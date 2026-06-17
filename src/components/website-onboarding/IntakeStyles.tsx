export default function IntakeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

      .intake-terminal {
        --black: #000000;
        --red: #cc0000;
        --red-hot: #ff1133;
        --red-dim: #660011;
        --blue-acc: #0055cc;
        font-family: 'Share Tech Mono', monospace;
      }

      .intake-terminal * { box-sizing: border-box; }

      .intake-body {
        background: #000;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image:
          linear-gradient(rgba(180,0,0,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,0,0,0.06) 1px, transparent 1px);
        background-size: 44px 44px;
        padding: 24px;
      }

      .t-shell {
        width: 660px;
        max-width: 100%;
        background: linear-gradient(160deg, #1c1c1c 0%, #101010 60%, #080808 100%);
        border-radius: 6px;
        overflow: hidden;
        box-shadow:
          0 0 0 1px #000,
          inset 0 1px 0 #3a3a3a,
          inset 0 -1px 0 #111,
          inset 1px 0 0 #2a2a2a,
          inset -1px 0 0 #111,
          0 32px 80px rgba(0,0,0,0.95),
          0 0 60px rgba(200,0,0,0.12),
          0 0 120px rgba(200,0,0,0.04);
      }

      .t-header {
        background: linear-gradient(180deg, #1e0000 0%, #110000 60%, #080000 100%);
        border-bottom: 2px solid var(--red);
        padding: 10px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .t-header::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px);
        pointer-events: none;
      }

      .t-header::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,60,60,0.6), transparent);
      }

      .logo-mark {
        font-family: 'Orbitron', sans-serif;
        font-weight: 900;
        font-size: 20px;
        letter-spacing: 6px;
        color: var(--red-hot);
        text-shadow: 0 0 8px var(--red-hot), 0 0 20px rgba(255,17,51,0.45), 0 0 40px rgba(255,17,51,0.15);
        line-height: 1;
      }

      .logo-sub {
        font-size: 8px;
        letter-spacing: 3px;
        color: #3a1010;
        margin-top: 3px;
        text-transform: uppercase;
      }

      .status-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--red-hot);
        box-shadow: 0 0 6px var(--red-hot), 0 0 12px rgba(255,17,51,0.4);
        animation: intake-pulse 2.2s ease-in-out infinite;
      }

      @keyframes intake-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(0.85); }
      }

      .status-label {
        font-size: 9px;
        letter-spacing: 2px;
        color: #442222;
      }

      .session-id {
        font-size: 8px;
        letter-spacing: 1px;
        color: #2a1010;
      }

      .t-progress {
        background: #060000;
        border-bottom: 1px solid #110000;
        padding: 7px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .prog-label {
        font-size: 8px;
        letter-spacing: 2px;
        color: #3a1010;
        white-space: nowrap;
      }

      .prog-track {
        flex: 1;
        height: 2px;
        background: #110000;
        border: 1px solid #1a0000;
        overflow: hidden;
      }

      .prog-fill {
        height: 100%;
        background: linear-gradient(90deg, #880000, var(--red-hot));
        box-shadow: 0 0 8px var(--red-hot);
        transition: width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .prog-pct {
        font-size: 9px;
        letter-spacing: 1px;
        color: var(--red-hot);
        min-width: 32px;
        text-align: right;
        text-shadow: 0 0 6px var(--red-hot);
      }

      .t-chat {
        height: 320px;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background:
          repeating-linear-gradient(0deg, transparent, transparent 21px, rgba(255,0,0,0.012) 21px, rgba(255,0,0,0.012) 22px),
          #000000;
        position: relative;
      }

      @media (min-width: 480px) {
        .t-chat {
          height: 400px;
        }
      }

      .t-chat::after {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px);
        pointer-events: none;
        z-index: 10;
      }

      .t-chat::-webkit-scrollbar { width: 3px; }
      .t-chat::-webkit-scrollbar-track { background: #050000; }
      .t-chat::-webkit-scrollbar-thumb { background: var(--red-dim); }

      .msg {
        display: flex;
        gap: 9px;
        max-width: 88%;
        animation: intake-msgIn 0.28s cubic-bezier(0.2, 0.8, 0.4, 1);
      }

      @keyframes intake-msgIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .msg.bot { align-self: flex-start; }
      .msg.user { align-self: flex-end; flex-direction: row-reverse; }

      .avatar {
        width: 30px; height: 30px;
        border-radius: 2px;
        display: flex; align-items: center; justify-content: center;
        font-size: 7px; font-weight: 700; letter-spacing: 0.5px;
        flex-shrink: 0; margin-top: 1px;
      }

      .msg.bot .avatar {
        background: linear-gradient(145deg, #1e0000, #080000);
        border: 1px solid #3a0000;
        color: var(--red-hot);
        box-shadow: 0 0 8px rgba(255,17,51,0.25), inset 0 1px 0 rgba(255,17,51,0.1);
      }

      .msg.user .avatar {
        background: linear-gradient(145deg, #00060e, #000208);
        border: 1px solid #001833;
        color: #4488cc;
      }

      .bubble {
        padding: 9px 13px;
        font-size: 12px;
        line-height: 1.65;
        border-radius: 1px;
        position: relative;
      }

      .msg.bot .bubble {
        background: linear-gradient(140deg, #130000, #0a0000);
        border: 1px solid #200000;
        border-left: 2px solid var(--red);
        color: #ddd;
        box-shadow: 0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.025);
      }

      .msg.user .bubble {
        background: linear-gradient(140deg, #00060e, #000208);
        border: 1px solid #001020;
        border-right: 2px solid var(--blue-acc);
        color: #8ab8e8;
        box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      }

      .typing { display: flex; gap: 5px; padding: 8px 2px; align-items: center; }

      .tdot {
        width: 5px; height: 5px; border-radius: 50%;
        background: var(--red);
        animation: intake-tdot 1.3s ease-in-out infinite;
      }

      .tdot:nth-child(2) { animation-delay: 0.2s; }
      .tdot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes intake-tdot {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
        30% { transform: translateY(-5px); opacity: 1; }
      }

      .sect {
        display: flex; align-items: center;
        gap: 10px; padding: 2px 0;
        font-size: 8px; letter-spacing: 3px;
        color: var(--red); text-transform: uppercase;
        animation: intake-msgIn 0.3s ease;
      }

      .sect::before, .sect::after {
        content: '';
        flex: 1; height: 1px;
        background: linear-gradient(90deg, transparent, var(--red-dim), transparent);
      }

      .t-input {
        border-top: 1px solid #110000;
        background: linear-gradient(180deg, #060000, #020000);
        padding: 12px 18px;
        min-height: 62px;
      }

      .choices { display: flex; flex-wrap: wrap; gap: 8px; }

      .cbtn {
        padding: 7px 15px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 11px; letter-spacing: 1px;
        cursor: pointer; border-radius: 2px;
        transition: all 0.12s;
        background: linear-gradient(180deg, #282828 0%, #181818 55%, #101010 100%);
        border: 1px solid #3a3a3a;
        border-top-color: #505050;
        border-bottom-color: #0a0a0a;
        color: #ccc;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.6);
      }

      .cbtn:hover {
        background: linear-gradient(180deg, #2e0000 0%, #1c0000 55%, #0e0000 100%);
        border-color: var(--red);
        border-top-color: #aa0000;
        color: var(--red-hot);
        box-shadow: inset 0 1px 0 rgba(255,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.5), 0 0 14px rgba(255,17,51,0.35), 0 2px 5px rgba(0,0,0,0.6);
        text-shadow: 0 0 8px var(--red-hot);
      }

      .cbtn:active { transform: translateY(1px); box-shadow: inset 0 1px 3px rgba(0,0,0,0.8); }

      .input-row { display: flex; gap: 8px; align-items: flex-end; }

      .t-field {
        flex: 1;
        background: #030000;
        border: 1px solid #1c0000;
        border-bottom-color: #330000;
        color: #eee;
        font-family: 'Share Tech Mono', monospace;
        font-size: 12px;
        padding: 8px 10px;
        outline: none;
        resize: none;
        min-height: 36px;
        max-height: 110px;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px #000;
        transition: border-color 0.18s, box-shadow 0.18s;
        line-height: 1.5;
      }

      .t-field:focus {
        border-color: var(--red);
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(255,17,51,0.18);
      }

      .t-field::placeholder { color: #2a0000; }

      .send-btn {
        padding: 8px 15px;
        font-family: 'Orbitron', sans-serif;
        font-size: 8px; letter-spacing: 1.5px;
        cursor: pointer; white-space: nowrap;
        border-radius: 2px;
        background: linear-gradient(180deg, #cc0000 0%, #880000 55%, #550000 100%);
        border: 1px solid #880000;
        border-top-color: #ee0000;
        border-bottom-color: #330000;
        color: #fff;
        text-shadow: 0 -1px 0 rgba(0,0,0,0.4);
        box-shadow: inset 0 1px 0 rgba(255,100,100,0.25), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.6);
        transition: all 0.12s;
      }

      .send-btn:hover {
        background: linear-gradient(180deg, #ee0000 0%, #aa0000 55%, #660000 100%);
        box-shadow: inset 0 1px 0 rgba(255,100,100,0.25), 0 0 16px rgba(255,17,51,0.45), 0 2px 6px rgba(0,0,0,0.6);
      }

      .send-btn:active { transform: translateY(1px); }

      .skip-btn {
        margin-top: 7px;
        background: none; border: none;
        color: #2a0000; font-family: 'Share Tech Mono', monospace;
        font-size: 9px; letter-spacing: 1px;
        cursor: pointer; display: block;
        transition: color 0.15s;
        padding: 0;
      }

      .skip-btn:hover { color: #550000; }

      .upload-zone {
        border: 1px dashed #2a0000;
        background: #030000;
        padding: 14px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }

      .upload-zone:hover, .upload-zone.drag-over {
        border-color: var(--red);
        background: #0a0000;
        box-shadow: 0 0 14px rgba(255,17,51,0.15);
      }

      .upload-label { font-size: 10px; color: #2a0000; letter-spacing: 1px; }
      .upload-icon { display: block; font-size: 20px; color: var(--red-dim); margin-bottom: 4px; }

      .file-chips { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }

      .chip {
        background: #130000; border: 1px solid #2a0000;
        padding: 3px 8px; font-size: 10px; color: #cc6666;
        border-radius: 1px; display: flex; align-items: center; gap: 6px;
      }

      .chip-x {
        cursor: pointer; color: var(--red); font-size: 11px; line-height: 1;
        background: none; border: none; font-family: inherit; padding: 0;
      }

      .chip-x:hover { color: var(--red-hot); }

      .complete-wrap { padding: 20px 18px; }

      .complete-head {
        font-family: 'Orbitron', sans-serif;
        font-size: 11px; letter-spacing: 4px;
        color: var(--red-hot);
        text-shadow: 0 0 10px var(--red-hot);
        margin-bottom: 14px;
        display: flex; align-items: center; gap: 10px;
      }

      .complete-head::after {
        content: '';
        flex: 1; height: 1px;
        background: linear-gradient(90deg, var(--red-dim), transparent);
      }

      .summary-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2px 12px;
        padding: 5px 0;
        border-bottom: 1px solid #0e0000;
        font-size: 11px;
        align-items: start;
      }

      @media (min-width: 480px) {
        .summary-row {
          grid-template-columns: 130px 1fr;
          gap: 6px 12px;
        }
      }

      .s-key { color: var(--red-hot); font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; padding-top: 2px; }
      .s-val { color: #aaa; line-height: 1.5; word-break: break-word; }

      .complete-footer {
        margin-top: 16px; font-size: 9px;
        color: #2a1010; letter-spacing: 2px;
        text-align: center;
      }

      .t-footer {
        background: #030000;
        border-top: 1px solid #0e0000;
        padding: 5px 18px;
        display: flex; justify-content: space-between; align-items: center;
      }

      .t-footer span {
        font-size: 8px; letter-spacing: 1px; color: #1a0000;
      }

      .blink-cursor {
        display: inline-block; width: 5px; height: 9px;
        background: var(--red); animation: intake-blink 1s step-end infinite;
        vertical-align: middle; margin-left: 2px;
      }

      @keyframes intake-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    `}</style>
  );
}
