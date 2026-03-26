"use client";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "1rem",
    }}>
      <div style={{
        background: "white", borderRadius: "12px",
        maxWidth: "600px", width: "100%",
        maxHeight: "80vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #e9ecef",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <h3 style={{ fontWeight: "700", fontSize: "1.1rem" }}>개인정보 수집 및 이용 동의</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "1.5rem",
            cursor: "pointer", color: "#868e96", lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: "0.9rem", lineHeight: "1.7", color: "#495057" }}>
            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              1. 개인정보 수집 목적
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              입주박람회 방문 예약 및 입장권 발급, 방문자 확인, 행사 안내 및 관련 정보 제공
            </p>

            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              2. 수집하는 개인정보 항목
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              <strong>필수:</strong> 성명, 휴대폰 번호, 이메일 주소<br />
              <strong>선택:</strong> 주소
            </p>

            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              3. 개인정보 보유 및 이용 기간
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              행사 종료 후 3개월까지 보유하며, 이후 즉시 파기합니다.
            </p>

            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              4. 개인정보 제3자 제공
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              수집된 개인정보는 제3자에게 제공되지 않습니다. 단, 법령에 의거한 경우는 예외입니다.
            </p>

            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              5. 개인정보 보안
            </h4>
            <p style={{ marginBottom: "1rem" }}>
              귀하의 개인정보는 AES-256 암호화 방식으로 안전하게 저장됩니다.
            </p>

            <h4 style={{ fontWeight: "700", color: "#212529", marginBottom: "0.75rem" }}>
              6. 동의 거부 권리
            </h4>
            <p>
              개인정보 수집에 동의하지 않을 권리가 있습니다. 단, 동의 거부 시 예약 서비스 이용이 제한될 수 있습니다.
            </p>
          </div>
        </div>

        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e9ecef" }}>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
