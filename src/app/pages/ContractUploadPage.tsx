import { useState } from 'react';
import { mockEvents, addContractUpload, verifyContractUpload } from '../mockData';
import { ContractUpload } from '../types';
import { Upload, Search, Check, AlertCircle, FileText, Copy, Shield } from 'lucide-react';

type Tab = 'upload' | 'verify';

function getInitialEventId(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('event') ?? '';
}

export default function ContractUploadPage() {
  const [tab, setTab] = useState<Tab>('upload');

  // ── 업로드 상태 ──
  const [eventId, setEventId] = useState(getInitialEventId);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ token: string; eventTitle: string } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);

  // ── 확인 상태 ──
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [verifyResult, setVerifyResult] = useState<ContractUpload | null>(null);
  const [verifyError, setVerifyError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      setUploadError('파일 크기는 20MB 이하여야 합니다.');
      return;
    }
    setFile(f);
    setUploadError('');
  }

  function handleUpload() {
    if (!eventId || !customerName.trim() || !customerPhone.trim() || !file) {
      setUploadError('모든 항목을 입력해주세요.');
      return;
    }
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setUploadError('올바른 전화번호를 입력해주세요. (10자리 이상)');
      return;
    }

    setUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;
      const phoneLast4 = phoneDigits.slice(-4);
      const event = mockEvents.find((ev) => ev.id === eventId);

      // 전화번호는 끝 4자리만 보관 — 실제 환경에서는 파일도 환경변수 암호화 키로 서버에 저장
      const token = addContractUpload({
        eventId,
        eventTitle: event?.title ?? '',
        customerName: customerName.trim(),
        customerPhone: `***-****-${phoneLast4}`,
        phoneLast4,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileDataUrl,
      });

      setUploadResult({ token, eventTitle: event?.title ?? '' });
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError('파일 읽기에 실패했습니다. 다시 시도해주세요.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  function handleVerify() {
    if (!verifyToken.trim() || verifyPhone.length !== 4) {
      setVerifyError('토큰과 전화번호 끝 4자리를 정확히 입력해주세요.');
      return;
    }
    const result = verifyContractUpload(verifyToken.trim().toUpperCase(), verifyPhone);
    if (result) {
      setVerifyResult(result);
      setVerifyError('');
    } else {
      setVerifyResult(null);
      setVerifyError('일치하는 계약서를 찾을 수 없습니다. 토큰 또는 전화번호 끝 4자리를 확인해주세요.');
    }
  }

  function copyToken(token: string) {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetUpload() {
    setUploadResult(null);
    setEventId('');
    setCustomerName('');
    setCustomerPhone('');
    setFile(null);
    setUploadError('');
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-[var(--brand-lime)]">
      {/* 헤더 */}
      <header className="bg-[var(--brand-dark)] text-white px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <FileText className="w-5 h-5 opacity-80" />
          <span className="font-semibold text-lg tracking-tight">계약서 업로드</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="flex border-b-2 border-[var(--brand-dark)] mb-6">
          {([['upload', '계약서 업로드', Upload], ['verify', '업로드 확인', Search]] as const).map(
            ([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium -mb-0.5 border-b-2 transition-colors ${
                  tab === key
                    ? 'border-[var(--brand-dark)] text-[var(--brand-dark)]'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            )
          )}
        </div>

        {/* ── 업로드 탭 ── */}
        {tab === 'upload' && (
          <>
            {uploadResult ? (
              /* 업로드 완료 */
              <div className="bg-white border-2 border-[var(--brand-dark)] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[var(--brand-dark)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--brand-dark)]">업로드 완료</div>
                    <div className="text-sm opacity-60">{uploadResult.eventTitle}</div>
                  </div>
                </div>

                {/* 토큰 박스 */}
                <div className="bg-[var(--brand-lime)] border border-[var(--brand-dark)]/20 p-4 mb-5">
                  <div className="text-xs font-bold text-[var(--brand-dark)] mb-2 uppercase tracking-wider">
                    확인 토큰 — 반드시 보관하세요
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xl font-mono font-bold text-[var(--brand-dark)] tracking-widest flex-1 break-all">
                      {uploadResult.token}
                    </code>
                    <button
                      onClick={() => copyToken(uploadResult.token)}
                      className="p-2 hover:opacity-60 flex-shrink-0 transition-opacity"
                      title="복사"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm opacity-60 mb-6">
                  이 토큰과 전화번호 끝 4자리로 <strong>"업로드 확인"</strong> 탭에서 업로드 여부를 확인할 수 있습니다.
                  토큰을 분실하면 확인이 불가능하니 꼭 기록해두세요.
                </p>

                <button
                  onClick={resetUpload}
                  className="w-full py-2.5 border-2 border-[var(--brand-dark)] text-sm font-medium hover:bg-[var(--brand-lime)] transition-colors"
                >
                  다른 계약서 업로드
                </button>
              </div>
            ) : (
              /* 업로드 폼 */
              <div className="bg-white border-2 border-[var(--brand-dark)] p-6 space-y-5">
                <p className="text-sm opacity-60">
                  계약서 파일을 업로드해주세요. 업로드 후 발급되는 토큰으로 접수 여부를 확인할 수 있습니다.
                </p>

                {/* 행사 선택 */}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    행사 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                  >
                    <option value="">행사를 선택하세요</option>
                    {mockEvents
                      .filter((e) => e.status === 'active')
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 고객명 */}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    고객명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="계약서에 기재된 성명"
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                  />
                </div>

                {/* 전화번호 */}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-dark)]"
                  />
                  <p className="text-xs opacity-50 mt-1">
                    업로드 확인 인증에 사용됩니다. 끝 4자리만 보관되며 나머지는 즉시 파기됩니다.
                  </p>
                </div>

                {/* 파일 업로드 */}
                <div>
                  <label className="block text-sm font-bold mb-1">
                    계약서 파일 <span className="text-red-500">*</span>
                  </label>
                  <label
                    htmlFor="file-upload"
                    className="block border-2 border-dashed border-gray-300 p-6 text-center hover:border-[var(--brand-dark)] transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-[var(--brand-dark)]">
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        <span className="break-all">{file.name}</span>
                        <span className="opacity-50 font-normal flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <div className="text-sm opacity-50">클릭하여 파일 선택</div>
                        <div className="text-xs opacity-40 mt-1">PDF, JPG, PNG · 최대 20MB</div>
                      </>
                    )}
                  </label>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                {/* 보안 안내 */}
                <div className="flex items-start gap-2 bg-[var(--brand-lime)] p-3 text-xs opacity-60">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  업로드된 계약서는 암호화되어 안전하게 보관됩니다. 개인정보는 최소한으로만 수집됩니다.
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading || !eventId || !customerName.trim() || !customerPhone.trim() || !file}
                  className="w-full py-3 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  {uploading ? '업로드 중...' : '계약서 업로드'}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── 확인 탭 ── */}
        {tab === 'verify' && (
          <div className="bg-white border-2 border-[var(--brand-dark)] p-6 space-y-5">
            <p className="text-sm opacity-60">
              업로드 시 발급받은 토큰과 전화번호 끝 4자리로 본인의 계약서 접수 여부를 확인합니다.
            </p>

            {/* 토큰 입력 */}
            <div>
              <label className="block text-sm font-bold mb-1">
                확인 토큰 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full border border-gray-300 px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>

            {/* 전화번호 끝 4자리 */}
            <div>
              <label className="block text-sm font-bold mb-1">
                전화번호 끝 4자리 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={verifyPhone}
                onChange={(e) => setVerifyPhone(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="w-full border border-gray-300 px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:border-[var(--brand-dark)]"
              />
            </div>

            {verifyError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {verifyError}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!verifyToken.trim() || verifyPhone.length !== 4}
              className="w-full py-3 bg-[var(--brand-dark)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              확인
            </button>

            {/* 확인 결과 */}
            {verifyResult && (
              <div className="border-2 border-[var(--brand-dark)] p-4 space-y-2.5">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">업로드 확인됨</span>
                </div>
                {(
                  [
                    ['행사', verifyResult.eventTitle],
                    ['고객명', verifyResult.customerName],
                    ['파일명', verifyResult.fileName],
                    ['파일 크기', `${(verifyResult.fileSize / 1024).toFixed(1)} KB`],
                    ['업로드 일시', new Date(verifyResult.uploadedAt).toLocaleString('ko-KR')],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <span className="opacity-50 flex-shrink-0">{label}</span>
                    <span className="font-medium text-right break-all">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
