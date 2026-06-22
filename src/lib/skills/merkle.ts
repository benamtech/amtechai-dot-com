/**
 * RFC 6962 / RFC 9162 Merkle tree primitives for the AMTECH authority transparency log
 * (docs/skills/standard/03 — "Option B"). Pure + dependency-free (node:crypto only), so the same
 * code runs in the build (sign-authority), the validator, and the link-first verifier.
 *
 * Domain separation (RFC 6962 §2.1): leaves are SHA-256(0x00 || entry); interior nodes are
 * SHA-256(0x01 || left || right). This prevents second-preimage attacks where a leaf is presented
 * as an interior node. The empty tree hashes to SHA-256("").
 *
 * The transparency log folds the EXISTING authority record bytes into a tree WITHOUT changing any
 * record: an entry is `canonicalJson(record)` and its Merkle leaf is `leafHash(entry)`. Note this is
 * intentionally distinct from `log.json.recordHash` (= SHA-256(canonicalJson(record)), no 0x00 prefix),
 * which keeps serving the Option-A hash-chain checks — both derive from the same unchanged bytes.
 *
 * Generation (root / inclusionProof / consistencyProof) operates over the full ordered array of leaf
 * hashes. Verification (verifyInclusion / verifyConsistency) is the RFC 9162 iterative algorithm and
 * needs ONLY the leaf hash, index, sizes, proof, and root(s) — so a thin client can check membership
 * without downloading the whole log.
 */
import { createHash } from 'node:crypto';

const LEAF_PREFIX = Buffer.from([0x00]);
const NODE_PREFIX = Buffer.from([0x01]);

const sha256 = (buf: Buffer): Buffer => createHash('sha256').update(buf).digest();
const toBuf = (hex: string): Buffer => Buffer.from(hex, 'hex');
const toHex = (buf: Buffer): string => buf.toString('hex');

/** RFC 6962 §2.1: MTH({}) = SHA-256(). The canonical empty-tree hash. */
export const EMPTY_TREE_ROOT = toHex(sha256(Buffer.alloc(0)));

/** Leaf hash of an entry: SHA-256(0x00 || entry). `entry` is the canonical bytes (e.g. canonicalJson(record)). */
export function leafHash(entry: Buffer | string): string {
  const bytes = typeof entry === 'string' ? Buffer.from(entry, 'utf8') : entry;
  return toHex(sha256(Buffer.concat([LEAF_PREFIX, bytes])));
}

/** Interior node hash: SHA-256(0x01 || left || right). Inputs/outputs are hex. */
export function nodeHash(leftHex: string, rightHex: string): string {
  return toHex(sha256(Buffer.concat([NODE_PREFIX, toBuf(leftHex), toBuf(rightHex)])));
}

/** Largest power of two STRICTLY less than n (RFC 6962 split point `k`). Requires n > 1. */
function largestPowerOfTwoLessThan(n: number): number {
  let k = 1;
  while (k << 1 < n) k <<= 1;
  return k;
}

/** Merkle Tree Hash over a subtree of already-computed leaf hashes (hex). */
function subtreeRoot(leaves: string[]): string {
  const n = leaves.length;
  if (n === 0) return EMPTY_TREE_ROOT;
  if (n === 1) return leaves[0];
  const k = largestPowerOfTwoLessThan(n);
  return nodeHash(subtreeRoot(leaves.slice(0, k)), subtreeRoot(leaves.slice(k)));
}

/** RFC 6962 Merkle Tree Hash (MTH) over the full ordered list of leaf hashes (hex). */
export function merkleRoot(leaves: string[]): string {
  return subtreeRoot(leaves);
}

/** RFC 6962 PATH(m, D[n]) — inclusion (audit) path for leaf `index` as an array of sibling hashes (hex). */
export function inclusionProof(leaves: string[], index: number): string[] {
  const n = leaves.length;
  if (index < 0 || index >= n) throw new RangeError(`inclusionProof: index ${index} out of range for size ${n}`);
  const path = (m: number, sub: string[]): string[] => {
    if (sub.length === 1) return [];
    const k = largestPowerOfTwoLessThan(sub.length);
    return m < k
      ? [...path(m, sub.slice(0, k)), subtreeRoot(sub.slice(k))]
      : [...path(m - k, sub.slice(k)), subtreeRoot(sub.slice(0, k))];
  };
  return path(index, leaves);
}

/** RFC 6962 PROOF(m, D[n]) = SUBPROOF(m, D[n], true) — consistency proof from size `first` to size `second`. */
export function consistencyProof(leaves: string[], first: number, second: number): string[] {
  if (first < 0 || first > second || second > leaves.length) {
    throw new RangeError(`consistencyProof: invalid sizes first=${first} second=${second} of ${leaves.length}`);
  }
  if (first === 0 || first === second) return [];
  const subproof = (m: number, sub: string[], b: boolean): string[] => {
    const n = sub.length;
    if (m === n) return b ? [] : [subtreeRoot(sub)];
    const k = largestPowerOfTwoLessThan(n);
    return m <= k
      ? [...subproof(m, sub.slice(0, k), b), subtreeRoot(sub.slice(k))]
      : [...subproof(m - k, sub.slice(k), false), subtreeRoot(sub.slice(0, k))];
  };
  return subproof(first, leaves.slice(0, second), true);
}

/**
 * RFC 9162 §2.1.3.2 — verify an inclusion proof from only the leaf hash, index, size, proof, and root.
 * Returns true iff `leafHashHex` is the leaf at `index` in the tree of `treeSize` leaves with root `rootHex`.
 */
export function verifyInclusion(
  leafHashHex: string,
  index: number,
  treeSize: number,
  proof: string[],
  rootHex: string,
): boolean {
  if (index >= treeSize || index < 0) return false;
  let fn = index;
  let sn = treeSize - 1;
  let r = leafHashHex;
  for (const p of proof) {
    if (sn === 0) return false;
    if ((fn & 1) === 1 || fn === sn) {
      r = nodeHash(p, r);
      if ((fn & 1) === 0) {
        do {
          fn >>= 1;
          sn >>= 1;
        } while ((fn & 1) === 0 && fn !== 0);
      }
    } else {
      r = nodeHash(r, p);
    }
    fn >>= 1;
    sn >>= 1;
  }
  return sn === 0 && r === rootHex;
}

/**
 * RFC 9162 §2.1.4.2 — verify a consistency proof: that the tree of size `second` (root `secondRootHex`)
 * is an append-only extension of the tree of size `first` (root `firstRootHex`). This is the append-only /
 * anti-rollback guarantee an agent uses against a pinned earlier STH.
 */
export function verifyConsistency(
  first: number,
  second: number,
  firstRootHex: string,
  secondRootHex: string,
  proof: string[],
): boolean {
  if (first > second || first < 0) return false;
  if (first === 0) return true; // every tree is consistent with the empty tree
  if (first === second) return proof.length === 0 && firstRootHex === secondRootHex;

  // RFC 9162: if `first` is an exact power of two, the first node is implied (firstRootHex) and prepended.
  const path = (first & (first - 1)) === 0 ? [firstRootHex, ...proof] : [...proof];
  if (path.length === 0) return false;

  let fn = first - 1;
  let sn = second - 1;
  while ((fn & 1) === 1) {
    fn >>= 1;
    sn >>= 1;
  }
  let fr = path[0];
  let sr = path[0];
  for (const c of path.slice(1)) {
    if (sn === 0) return false;
    if ((fn & 1) === 1 || fn === sn) {
      fr = nodeHash(c, fr);
      sr = nodeHash(c, sr);
      if ((fn & 1) === 0) {
        do {
          fn >>= 1;
          sn >>= 1;
        } while ((fn & 1) === 0 && fn !== 0);
      }
    } else {
      sr = nodeHash(sr, c);
    }
    fn >>= 1;
    sn >>= 1;
  }
  return fn === 0 && fr === firstRootHex && sr === secondRootHex;
}
