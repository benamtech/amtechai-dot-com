import { useState, useEffect, useCallback, useRef } from 'react';
import IntakeStyles from './IntakeStyles';
import IntakeHeader from './IntakeHeader';
import IntakeProgress from './IntakeProgress';
import IntakeChat, { type ChatItem } from './IntakeChat';
import IntakeInput from './IntakeInput';
import IntakeSummary from './IntakeSummary';
import { INTAKE_SCRIPT, countAnswerableSteps, type ScriptNode } from './intakeScript';
import {
  createSession,
  loadSession,
  updateSession,
  uploadFile,
  getSessionFiles,
  type IntakeSession,
} from './intakeService';

const SESSION_STORAGE_KEY = 'amtech_intake_session';
const answerableCount = countAnswerableSteps();

function generateSessionCode(): string {
  return 'SID-' + Date.now().toString(36).toUpperCase();
}

function computeProgress(answers: Record<string, unknown>): number {
  const answered = Object.keys(answers).filter(
    (k) => answers[k] !== null && answers[k] !== undefined
  ).length;
  return Math.min(100, Math.round((answered / answerableCount) * 100));
}

function rebuildChatHistory(
  answers: Record<string, unknown>,
  targetStep: number,
  fileRecords: Record<string, string[]>
): ChatItem[] {
  const items: ChatItem[] = [];
  let scriptIdx = 0;

  while (scriptIdx < targetStep && scriptIdx < INTAKE_SCRIPT.length) {
    const node = INTAKE_SCRIPT[scriptIdx];

    if (node.condition && !node.condition(answers)) {
      scriptIdx++;
      continue;
    }

    if (node.type === 'bot_msg') {
      items.push({ type: 'bot', content: node.text! });
    } else if (node.type === 'section') {
      items.push({ type: 'section', content: node.label! });
    } else if (node.type === 'complete') {
      items.push({ type: 'bot', content: node.text! });
    } else if (node.key) {
      items.push({ type: 'bot', content: node.text! });
      const val = answers[node.key];
      if (val !== null && val !== undefined) {
        if (node.type === 'file') {
          const fNames = fileRecords[node.key];
          if (fNames && fNames.length > 0) {
            items.push({ type: 'user', content: fNames.join(', ') });
          }
        } else {
          items.push({ type: 'user', content: String(val) });
        }
      }
    }

    scriptIdx++;
  }

  return items;
}

export default function IntakeTerminal() {
  const sessionRef = useRef<IntakeSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [currentNode, setCurrentNode] = useState<ScriptNode | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCode, setSessionCode] = useState('');
  const stepRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    initSession();
  }, []);

  async function initSession() {
    const savedCode = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedCode) {
      const existing = await loadSession(savedCode);
      if (existing) {
        sessionRef.current = existing;
        setSessionCode(existing.session_code);
        const savedAnswers = (existing.answers as Record<string, unknown>) || {};
        setAnswers(savedAnswers);
        stepRef.current = existing.current_step;

        const fileRecords: Record<string, string[]> = {};
        const files = await getSessionFiles(existing.id);
        files.forEach((f) => {
          if (!fileRecords[f.field_key]) fileRecords[f.field_key] = [];
          fileRecords[f.field_key].push(f.file_name);
        });

        if (existing.status === 'completed') {
          const history = rebuildChatHistory(savedAnswers, INTAKE_SCRIPT.length, fileRecords);
          setChatItems(history);
          setIsComplete(true);
          setIsLoading(false);
          return;
        }

        const history = rebuildChatHistory(savedAnswers, existing.current_step, fileRecords);
        setChatItems(history);
        setIsLoading(false);
        runStep(existing.current_step, savedAnswers);
        return;
      }
    }

    const code = generateSessionCode();
    setSessionCode(code);
    sessionStorage.setItem(SESSION_STORAGE_KEY, code);
    const newSession = await createSession(code);
    if (newSession) {
      sessionRef.current = newSession;
      setIsLoading(false);
      runStep(0, {});
    }
  }

  const addChat = useCallback((item: ChatItem) => {
    setChatItems((prev) => [...prev, item]);
  }, []);

  const removeTyping = useCallback(() => {
    setChatItems((prev) => prev.filter((item) => item.type !== 'typing'));
  }, []);

  function runStep(index: number, currentAnswers: Record<string, unknown>) {
    if (index >= INTAKE_SCRIPT.length || runningRef.current) return;
    runningRef.current = true;
    stepRef.current = index;

    const node = INTAKE_SCRIPT[index];

    if (node.condition && !node.condition(currentAnswers)) {
      runningRef.current = false;
      stepRef.current = index + 1;
      runStep(index + 1, currentAnswers);
      return;
    }

    const delay = node.delay || 400;

    if (node.type === 'bot_msg') {
      addChat({ type: 'typing', content: '' });
      setTimeout(() => {
        removeTyping();
        addChat({ type: 'bot', content: node.text! });
        runningRef.current = false;
        stepRef.current = index + 1;
        if (sessionRef.current) {
          updateSession(sessionRef.current.id, { current_step: index + 1 });
        }
        runStep(index + 1, currentAnswers);
      }, delay + 700);
    } else if (node.type === 'section') {
      setTimeout(() => {
        addChat({ type: 'section', content: node.label! });
        runningRef.current = false;
        stepRef.current = index + 1;
        if (sessionRef.current) {
          updateSession(sessionRef.current.id, { current_step: index + 1 });
        }
        runStep(index + 1, currentAnswers);
      }, delay);
    } else if (node.type === 'complete') {
      addChat({ type: 'typing', content: '' });
      setTimeout(() => {
        removeTyping();
        addChat({ type: 'bot', content: node.text! });
        setIsComplete(true);
        setCurrentNode(null);
        runningRef.current = false;
        if (sessionRef.current) {
          updateSession(sessionRef.current.id, {
            current_step: index + 1,
            answers: currentAnswers,
            status: 'completed',
          });
        }
      }, delay + 800);
    } else {
      addChat({ type: 'typing', content: '' });
      setTimeout(() => {
        removeTyping();
        addChat({ type: 'bot', content: node.text! });
        setCurrentNode(node);
        runningRef.current = false;
      }, delay + 600);
    }
  }

  async function handleSubmit(key: string, value: string | null, files?: File[]) {
    const newAnswers = { ...answers };

    if (files && files.length > 0 && sessionRef.current) {
      const uploadedNames: string[] = [];
      for (const file of files) {
        const result = await uploadFile(sessionRef.current.id, key, file);
        if (result) uploadedNames.push(result.fileName);
      }
      newAnswers[key] = uploadedNames;
    } else {
      newAnswers[key] = value;
    }

    setAnswers(newAnswers);

    if (value) {
      addChat({ type: 'user', content: value });
    }

    setCurrentNode(null);

    const nextStep = stepRef.current + 1;
    stepRef.current = nextStep;

    if (sessionRef.current) {
      await updateSession(sessionRef.current.id, {
        current_step: nextStep,
        answers: newAnswers,
      });
    }

    runStep(nextStep, newAnswers);
  }

  const progress = computeProgress(answers);

  if (isLoading) {
    return (
      <div className="intake-terminal">
        <IntakeStyles />
        <div className="intake-body">
          <div className="t-shell">
            <IntakeHeader sessionCode={sessionCode || '...'} />
            <div className="t-chat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="typing">
                <div className="tdot" />
                <div className="tdot" />
                <div className="tdot" />
              </div>
            </div>
            <div className="t-footer">
              <span>AMTECH // ENCRYPTED INTAKE v2.4</span>
              <span>INITIALIZING...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="intake-terminal">
      <IntakeStyles />
      <div className="intake-body">
        <div className="t-shell">
          <IntakeHeader sessionCode={sessionCode} />
          <IntakeProgress percentage={progress} />
          <IntakeChat items={chatItems} />
          <div className="t-input">
            {isComplete ? (
              <IntakeSummary answers={answers} />
            ) : (
              <IntakeInput node={currentNode} onSubmit={handleSubmit} />
            )}
          </div>
          <div className="t-footer">
            {isComplete ? (
              <>
                <span>INTAKE COMPLETE</span>
                <span style={{ color: '#ff1133' }}>&#x25AE; SUBMITTED</span>
              </>
            ) : (
              <>
                <span>AMTECH // ENCRYPTED INTAKE v2.4</span>
                <span>
                  &copy; 2025 AMERICAN MARKETING TECHNOLOGY
                  <span className="blink-cursor" />
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
