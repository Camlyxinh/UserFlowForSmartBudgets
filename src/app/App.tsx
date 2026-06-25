import { useState } from "react";

const MOMO_RED = "#d4003b";
const MOMO_RED_LIGHT = "#fff0f3";
const ORANGE = "#ff6b35";
const GREEN = "#16a34a";
const GREEN_LIGHT = "#f0fdf4";
const ORANGE_LIGHT = "#fff7ed";
const BLUE = "#2563eb";
const BLUE_LIGHT = "#eff6ff";
const GRAY = "#6b7280";
const GRAY_LIGHT = "#f7f8fc";

type NodeType = "start" | "end" | "process" | "decision" | "action" | "warning" | "success" | "block";

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  sub?: string;
  phase?: number;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  color?: string;
  dashed?: boolean;
}

const phases = [
  { id: 1, label: "Thiết lập Hũ", color: BLUE, bg: BLUE_LIGHT },
  { id: 2, label: "Thanh toán & Phân loại", color: MOMO_RED, bg: MOMO_RED_LIGHT },
  { id: 3, label: "Kiểm soát Hạn mức", color: ORANGE, bg: ORANGE_LIGHT },
  { id: 4, label: "Sau Thanh toán", color: GREEN, bg: GREEN_LIGHT },
];

function NodeBox({
  node,
  onClick,
  active,
}: {
  node: FlowNode;
  onClick: () => void;
  active: boolean;
}) {
  const styles: Record<NodeType, { bg: string; border: string; text: string; shape: string }> = {
    start: { bg: MOMO_RED, border: MOMO_RED, text: "#fff", shape: "rounded-full" },
    end: { bg: "#0f0f1a", border: "#0f0f1a", text: "#fff", shape: "rounded-full" },
    process: { bg: "#fff", border: "#e5e7eb", text: "#0f0f1a", shape: "rounded-xl" },
    decision: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e", shape: "rounded-xl" },
    action: { bg: BLUE_LIGHT, border: BLUE, text: "#1e3a8a", shape: "rounded-xl" },
    warning: { bg: ORANGE_LIGHT, border: ORANGE, text: "#9a3412", shape: "rounded-xl" },
    success: { bg: GREEN_LIGHT, border: GREEN, text: "#14532d", shape: "rounded-xl" },
    block: { bg: "#fef2f2", border: MOMO_RED, text: "#7f1d1d", shape: "rounded-xl" },
  };

  const s = styles[node.type];

  return (
    <button
      onClick={onClick}
      className="group relative text-center transition-all duration-200"
      style={{
        outline: "none",
      }}
    >
      <div
        className={`relative w-full px-4 py-3 ${s.shape} border-2 transition-all duration-200`}
        style={{
          backgroundColor: s.bg,
          borderColor: active ? s.border : (node.type === "process" ? "#e5e7eb" : s.border),
          boxShadow: active
            ? `0 0 0 3px ${s.border}33, 0 4px 16px ${s.border}22`
            : "0 1px 4px rgba(0,0,0,0.06)",
          transform: active ? "scale(1.02)" : "scale(1)",
        }}
      >
        <div
          className="font-semibold text-sm leading-snug"
          style={{ color: s.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {node.label}
        </div>
        {node.sub && (
          <div
            className="text-xs mt-1 leading-snug opacity-75"
            style={{ color: s.text, fontFamily: "'Inter', sans-serif" }}
          >
            {node.sub}
          </div>
        )}
      </div>
    </button>
  );
}

function Arrow({ label, color = "#94a3b8", dashed = false }: { label?: string; color?: string; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center my-1">
      <div
        className="w-px"
        style={{
          height: "24px",
          backgroundColor: dashed ? "transparent" : color,
          backgroundImage: dashed ? `repeating-linear-gradient(to bottom, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)` : undefined,
        }}
      />
      {label && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full mb-1"
          style={{
            backgroundColor: `${color}18`,
            color: color,
            fontFamily: "'Inter', sans-serif",
            border: `1px solid ${color}44`,
          }}
        >
          {label}
        </span>
      )}
      <svg width="10" height="8" viewBox="0 0 10 8">
        <path d="M5 8L0 0h10z" fill={color} />
      </svg>
    </div>
  );
}

function BranchArrow({
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
}: {
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}) {
  return (
    <div className="relative flex items-start justify-center w-full my-2" style={{ height: 40 }}>
      {/* left branch */}
      <div className="absolute left-0 flex flex-col items-center" style={{ width: "calc(50% - 16px)" }}>
        <div className="flex items-center gap-1">
          <div style={{ width: 1, height: 40, backgroundColor: leftColor }} />
        </div>
      </div>
      {/* horizontal bar */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: "25%",
          right: "25%",
          height: 1,
          backgroundColor: "#cbd5e1",
        }}
      />
      {/* right branch */}
      <div className="absolute right-0 flex flex-col items-center" style={{ width: "calc(50% - 16px)" }}>
        <div style={{ width: 1, height: 40, backgroundColor: rightColor }} />
      </div>
    </div>
  );
}

function PhaseHeader({ phase }: { phase: (typeof phases)[0] }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
      style={{ backgroundColor: phase.bg, border: `1.5px solid ${phase.color}33` }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
        style={{ backgroundColor: phase.color, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {phase.id}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: phase.color, fontFamily: "'Inter', sans-serif" }}>
          Giai đoạn {phase.id}
        </div>
        <div className="font-bold text-sm" style={{ color: "#0f0f1a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {phase.label}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { color: MOMO_RED, fill: MOMO_RED, label: "Bắt đầu / Kết thúc", shape: "circle" },
    { color: "#e5e7eb", fill: "#fff", label: "Tiến trình", shape: "rect" },
    { color: "#f59e0b", fill: "#fffbeb", label: "Quyết định", shape: "rect" },
    { color: BLUE, fill: BLUE_LIGHT, label: "Hành động hệ thống", shape: "rect" },
    { color: ORANGE, fill: ORANGE_LIGHT, label: "Cảnh báo (Soft Lock)", shape: "rect" },
    { color: GREEN, fill: GREEN_LIGHT, label: "Thành công", shape: "rect" },
    { color: MOMO_RED, fill: "#fef2f2", label: "Chặn (Hard Lock)", shape: "rect" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.shape === "circle" ? (
            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: item.color, backgroundColor: item.fill }} />
          ) : (
            <div className="w-4 h-3 rounded border-2" style={{ borderColor: item.color, backgroundColor: item.fill }} />
          )}
          <span className="text-xs" style={{ color: GRAY, fontFamily: "'Inter', sans-serif" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Detail panel content for each node
const nodeDetails: Record<string, { title: string; description: string; details: string[] }> = {
  start: {
    title: "Người dùng mở MoMo",
    description: "Điểm khởi đầu của hành trình sử dụng tính năng Hũ Chi Tiêu.",
    details: ["Người dùng đã đăng nhập MoMo", "Tài khoản có số dư hoạt động", "Lần đầu hoặc đã từng dùng tính năng"],
  },
  setup_prompt: {
    title: "Nhắc thiết lập Hũ",
    description: "MoMo chủ động gợi ý thiết lập Hũ Chi Tiêu đầu tháng hoặc sau khi nhận lương.",
    details: ["Hiển thị banner thông minh khi nhận lương", "Gợi ý đầu tháng tự động", "Người dùng có thể bỏ qua"],
  },
  has_jar: {
    title: "Đã có Hũ Chi Tiêu?",
    description: "Hệ thống kiểm tra xem người dùng đã thiết lập Hũ hay chưa.",
    details: ["Kiểm tra trạng thái trong database", "Phân nhánh luồng xử lý", "Điều hướng phù hợp"],
  },
  create_jar: {
    title: "Tạo Hũ Chi Tiêu",
    description: "Người dùng tạo các Hũ và phân bổ ngân sách từ nguồn tiền của mình.",
    details: [
      "Chọn danh mục: Ăn uống, Mua sắm, Di chuyển...",
      "Nhập hạn mức theo tuần hoặc tháng",
      "Chọn nguồn tiền (ví MoMo, tài khoản liên kết)",
      "Kích hoạt chế độ Soft hoặc Hard Lock",
    ],
  },
  jar_active: {
    title: "Hũ đang hoạt động",
    description: "Hũ Chi Tiêu đã được thiết lập và đang theo dõi chi tiêu.",
    details: ["Hiển thị số dư còn lại theo từng Hũ", "Cập nhật real-time sau mỗi giao dịch", "Widget tóm tắt trên màn hình chính"],
  },
  scan_qr: {
    title: "Người dùng quét mã QR",
    description: "Giữ nguyên luồng thanh toán QR nhanh 3 giây của MoMo, không can thiệp.",
    details: ["Quét QR tại quầy thanh toán", "QR động (Dynamic QR) hoặc QR tĩnh", "Tốc độ nhận diện < 1 giây"],
  },
  detect_merchant: {
    title: "Nhận diện loại giao dịch",
    description: "Hệ thống phân biệt giao dịch thương mại (có MCC) và chuyển khoản cá nhân.",
    details: ["Phân tích thông tin QR code", "Tra cứu Merchant Category Code (MCC)", "Xác định loại người nhận tiền"],
  },
  is_merchant: {
    title: "Có mã MCC không?",
    description: "Quyết định phân nhánh dựa trên loại giao dịch.",
    details: ["MCC = mã chuẩn quốc tế phân loại cửa hàng", "80% giao dịch tại cửa hàng có MCC", "20% còn lại là chuyển khoản cá nhân"],
  },
  auto_categorize: {
    title: "Tự động phân loại (80%)",
    description: "Hệ thống tự động xếp vào đúng Hũ dựa trên MCC, không cần thao tác từ người dùng.",
    details: [
      "MCC 5812 → Ăn uống (Spicy Box, Highlands...)",
      "MCC 5411 → Siêu thị / Mua sắm",
      "MCC 4111 → Di chuyển (Grab, taxi...)",
      "Ẩn hoàn toàn, không gián đoạn thanh toán",
    ],
  },
  confirm_screen: {
    title: "Màn hình Xác nhận thanh toán",
    description: "Bước xác nhận cuối trước khi tiền được trừ. Đây là điểm can thiệp của Lock.",
    details: ["Hiển thị số tiền, người nhận", "Kiểm tra trạng thái Hũ Chi Tiêu", "Áp dụng Soft/Hard Lock nếu cần"],
  },
  check_budget: {
    title: "Kiểm tra hạn mức Hũ",
    description: "Hệ thống so sánh số tiền giao dịch với số dư còn lại của Hũ tương ứng.",
    details: ["Tính số dư Hũ = Hạn mức - Chi tiêu đã dùng", "So sánh với số tiền giao dịch hiện tại", "Xác định mức vượt nếu có"],
  },
  within_limit: {
    title: "Trong hạn mức?",
    description: "Phân nhánh theo kết quả kiểm tra ngân sách.",
    details: ["Trong hạn mức → Thanh toán bình thường", "Vượt hạn mức → Kích hoạt cơ chế Lock"],
  },
  normal_payment: {
    title: "Thanh toán bình thường",
    description: "Không có cảnh báo, giao dịch diễn ra trơn tru như thông thường.",
    details: ["Giao dịch thành công ngay lập tức", "Cập nhật số dư Hũ tự động", "Không thêm bước nào cho người dùng"],
  },
  soft_lock: {
    title: "Soft Lock — Cú hích lý trí",
    description: "Giao diện màn hình xác nhận chuyển sang màu cam với cảnh báo rõ ràng.",
    details: [
      "Màn hình chuyển màu cam cảnh báo",
      '"Khoản chi này sẽ làm bạn vượt hạn mức Ăn uống tuần này 50.000đ"',
      "Hai nút: [Vẫn tiếp tục] và [Hủy]",
      "Giao dịch KHÔNG bị chặn — chỉ nhắc nhở",
    ],
  },
  hard_lock: {
    title: "Hard Lock — Kỷ luật thép",
    description: "Hệ thống từ chối hoàn toàn giao dịch khi vượt hạn mức đã cam kết.",
    details: [
      "Chỉ áp dụng khi người dùng đã Opt-in",
      "Màn hình đỏ, giao dịch bị chặn cứng",
      "Gợi ý điều hướng tiền từ Hũ khác",
      "Lựa chọn: Hủy hoặc Dùng Hũ khác",
    ],
  },
  user_confirm: {
    title: "Người dùng xác nhận tiếp tục?",
    description: "Sau cảnh báo Soft Lock, người dùng tự quyết định có tiếp tục hay không.",
    details: ["Người dùng kiểm soát hoàn toàn", "Chọn [Vẫn tiếp tục] → Thanh toán", "Chọn [Hủy] → Dừng giao dịch"],
  },
  redirect_jar: {
    title: "Điều hướng sang Hũ khác",
    description: "Khi Hard Lock kích hoạt, người dùng có thể chọn dùng ngân sách từ Hũ khác nếu thực sự cần.",
    details: ["Hiển thị danh sách Hũ còn số dư", "Người dùng chọn Hũ thay thế", "Xác nhận lại giao dịch với Hũ mới"],
  },
  payment_success: {
    title: "Thanh toán thành công",
    description: "Giao dịch hoàn tất. Màn hình success của MoMo hiển thị.",
    details: ["Hiển thị xác nhận thanh toán", "Số tiền và người nhận", "Cập nhật ngay số dư Hũ Chi Tiêu"],
  },
  pill_tag: {
    title: "Pill Tags — Gắn nhãn tùy chọn (20%)",
    description: "Chỉ hiển thị sau giao dịch cá nhân không tự phân loại được. Widget nhỏ gọn, không bắt buộc.",
    details: [
      "Hiển thị tinh tế dưới màn hình thành công",
      "Các chip: Ăn uống / Mua sắm / Hóa đơn / ...",
      "1 chạm để phân loại",
      "Nếu bỏ qua → tự động vào 'Chi tiêu khác'",
    ],
  },
  update_jar: {
    title: "Cập nhật số dư Hũ",
    description: "Hệ thống tự động trừ số tiền giao dịch vào Hũ tương ứng.",
    details: ["Cập nhật real-time", "Gửi thông báo nếu gần đạt hạn mức (≥ 80%)", "Lưu lịch sử giao dịch theo Hũ"],
  },
  view_report: {
    title: "Xem báo cáo Hũ",
    description: "Người dùng xem tổng quan chi tiêu và điều chỉnh ngân sách nếu cần.",
    details: ["Biểu đồ chi tiêu theo tuần/tháng", "So sánh với hạn mức đã đặt", "Gợi ý điều chỉnh từ AI"],
  },
  end: {
    title: "Kết thúc hành trình",
    description: "Người dùng hoàn thành một chu kỳ sử dụng Hũ Chi Tiêu.",
    details: ["Hũ được cập nhật đầy đủ", "Người dùng nắm rõ tình trạng chi tiêu", "Sẵn sàng cho giao dịch tiếp theo"],
  },
  other_jar: {
    title: "Xếp vào 'Chi tiêu khác'",
    description: "Giao dịch không được phân loại sẽ tự động vào nhóm mặc định.",
    details: ["Tự động sau 24h nếu không gắn tag", "Vẫn được tính vào tổng chi tiêu", "Người dùng có thể chỉnh lại sau"],
  },
  cancel: {
    title: "Hủy giao dịch",
    description: "Người dùng chủ động hủy sau khi nhận cảnh báo hoặc bị Hard Lock.",
    details: ["Không trừ tiền", "Quay về màn hình chính MoMo", "Không ảnh hưởng số dư Hũ"],
  },
};

export default function App() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleNodeClick = (id: string) => {
    setActiveNode(activeNode === id ? null : id);
  };

  const detail = activeNode ? nodeDetails[activeNode] : null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f7f8fc", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-6 py-4 border-b"
        style={{
          backgroundColor: "#fff",
          borderColor: "rgba(0,0,0,0.07)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg"
              style={{ background: `linear-gradient(135deg, ${MOMO_RED}, #ff3d6b)` }}
            >
              M
            </div>
            <div>
              <div
                className="font-bold text-base leading-tight"
                style={{ color: "#0f0f1a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Hũ Chi Tiêu Thông Minh
              </div>
              <div className="text-xs" style={{ color: GRAY }}>
                MoMo Smart Budgets — User Flow Diagram
              </div>
            </div>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ backgroundColor: MOMO_RED_LIGHT, color: MOMO_RED, border: `1px solid ${MOMO_RED}22` }}
          >
            v1.0 · 2026
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Legend */}
        <div
          className="mb-8 p-4 rounded-2xl border"
          style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: GRAY }}>
            Chú thích ký hiệu
          </div>
          <Legend />
        </div>

        {/* Hint */}
        <div
          className="mb-6 flex items-center gap-2 text-xs px-4 py-2 rounded-xl"
          style={{ backgroundColor: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE}22` }}
        >
          <span>Nhấp vào bất kỳ node nào để xem chi tiết hành động</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main flow */}
          <div className="lg:col-span-2 space-y-6">

            {/* ─── PHASE 1 ─── */}
            <PhaseHeader phase={phases[0]} />
            <div className="flex flex-col items-center gap-1 px-2">
              {/* Linear */}
              <div className="flex flex-col items-stretch gap-1">
                <NodeBox node={{ id: "start", type: "start", label: "Người dùng mở MoMo" }} onClick={() => handleNodeClick("start")} active={activeNode === "start"} />
                <Arrow color={MOMO_RED} />
                <NodeBox node={{ id: "setup_prompt", type: "action", label: "Gợi ý thiết lập Hũ Chi Tiêu", sub: "Hiển thị đầu tháng hoặc sau khi nhận lương" }} onClick={() => handleNodeClick("setup_prompt")} active={activeNode === "setup_prompt"} />
                <Arrow color={BLUE} />
                <NodeBox node={{ id: "has_jar", type: "decision", label: "Đã có Hũ Chi Tiêu chưa?" }} onClick={() => handleNodeClick("has_jar")} active={activeNode === "has_jar"} />
              </div>

              {/* Branch */}
              <div className="flex items-start gap-3 mt-1">
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: MOMO_RED_LIGHT, color: MOMO_RED }}>✗ Chưa có</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: MOMO_RED }} /></div>
                  <NodeBox node={{ id: "create_jar", type: "action", label: "Tạo Hũ + Phân bổ ngân sách", sub: "Chọn danh mục, hạn mức, chế độ Lock" }} onClick={() => handleNodeClick("create_jar")} active={activeNode === "create_jar"} />
                </div>
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: GREEN_LIGHT, color: GREEN }}>✓ Rồi</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: GREEN }} /></div>
                  <NodeBox node={{ id: "jar_active", type: "success", label: "Hũ đang hoạt động", sub: "Hiển thị số dư còn lại" }} onClick={() => handleNodeClick("jar_active")} active={activeNode === "jar_active"} />
                </div>
              </div>

              <Arrow color="#94a3b8" label="merge" />
            </div>

            {/* ─── PHASE 2 ─── */}
            <PhaseHeader phase={phases[1]} />
            <div className="flex flex-col items-center gap-1 px-2">
              {/* Linear */}
              <div className="flex flex-col items-stretch gap-1">
                <NodeBox node={{ id: "scan_qr", type: "action", label: "Quét mã QR thanh toán", sub: "Giữ nguyên luồng 3 giây của MoMo" }} onClick={() => handleNodeClick("scan_qr")} active={activeNode === "scan_qr"} />
                <Arrow color={MOMO_RED} />
                <NodeBox node={{ id: "detect_merchant", type: "action", label: "Hệ thống nhận diện giao dịch", sub: "Tra cứu Merchant Category Code (MCC)" }} onClick={() => handleNodeClick("detect_merchant")} active={activeNode === "detect_merchant"} />
                <Arrow color={MOMO_RED} />
                <NodeBox node={{ id: "is_merchant", type: "decision", label: "Có mã MCC (cửa hàng)?" }} onClick={() => handleNodeClick("is_merchant")} active={activeNode === "is_merchant"} />
              </div>

              {/* Branch */}
              <div className="flex items-start gap-3 mt-1">
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: GREEN_LIGHT, color: GREEN }}>✓ Có (80%)</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: GREEN }} /></div>
                  <NodeBox node={{ id: "auto_categorize", type: "success", label: "Tự động phân loại vào Hũ", sub: "Ẩn hoàn toàn, không gián đoạn" }} onClick={() => handleNodeClick("auto_categorize")} active={activeNode === "auto_categorize"} />
                </div>
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: ORANGE_LIGHT, color: ORANGE }}>✗ Không (20%)</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: ORANGE }} /></div>
                  <NodeBox node={{ id: "other_jar", type: "warning", label: "Tạm xếp 'Chi tiêu khác'", sub: "Pill Tags sẽ hỏi sau khi trả tiền" }} onClick={() => handleNodeClick("other_jar")} active={activeNode === "other_jar"} />
                </div>
              </div>

              <Arrow color="#94a3b8" label="merge" />
            </div>

            {/* ─── PHASE 3 ─── */}
            <PhaseHeader phase={phases[2]} />
            <div className="flex flex-col items-center gap-1 px-2">
              {/* Linear */}
              <div className="flex flex-col items-stretch gap-1">
                <NodeBox node={{ id: "confirm_screen", type: "process", label: "Màn hình Xác nhận thanh toán", sub: "Điểm can thiệp của cơ chế Lock" }} onClick={() => handleNodeClick("confirm_screen")} active={activeNode === "confirm_screen"} />
                <Arrow color={MOMO_RED} />
                <NodeBox node={{ id: "check_budget", type: "action", label: "Kiểm tra hạn mức Hũ", sub: "So sánh số tiền vs. số dư còn lại" }} onClick={() => handleNodeClick("check_budget")} active={activeNode === "check_budget"} />
                <Arrow color={MOMO_RED} />
                <NodeBox node={{ id: "within_limit", type: "decision", label: "Trong hạn mức?" }} onClick={() => handleNodeClick("within_limit")} active={activeNode === "within_limit"} />
              </div>

              {/* 3-way branch */}
              <div className="flex items-start gap-3 mt-1">
                {/* In limit */}
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: GREEN_LIGHT, color: GREEN }}>✓ Còn hạn mức</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: GREEN }} /></div>
                  <NodeBox node={{ id: "normal_payment", type: "success", label: "Thanh toán bình thường" }} onClick={() => handleNodeClick("normal_payment")} active={activeNode === "normal_payment"} />
                </div>

                {/* Soft lock */}
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: ORANGE_LIGHT, color: ORANGE }}>⚠ Vượt · Soft</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: ORANGE }} /></div>
                  <NodeBox node={{ id: "soft_lock", type: "warning", label: "Cảnh báo cam", sub: "Vẫn cho phép tiếp tục" }} onClick={() => handleNodeClick("soft_lock")} active={activeNode === "soft_lock"} />
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: ORANGE }} /></div>
                  <NodeBox node={{ id: "user_confirm", type: "decision", label: "Tiếp tục?" }} onClick={() => handleNodeClick("user_confirm")} active={activeNode === "user_confirm"} />
                  <div className="flex items-start gap-1 mt-1">
                    <div className="flex flex-col items-stretch gap-1">
                      <div className="flex justify-center"><span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: GREEN_LIGHT, color: GREEN }}>✓</span></div>
                      <div className="flex justify-center"><div style={{ width: 1, height: 10, backgroundColor: GREEN }} /></div>
                      <NodeBox node={{ id: "payment_success_soft", type: "success", label: "Thanh toán" }} onClick={() => handleNodeClick("payment_success")} active={activeNode === "payment_success"} />
                    </div>
                    <div className="flex flex-col items-stretch gap-1">
                      <div className="flex justify-center"><span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "#fef2f2", color: MOMO_RED }}>✗</span></div>
                      <div className="flex justify-center"><div style={{ width: 1, height: 10, backgroundColor: MOMO_RED }} /></div>
                      <NodeBox node={{ id: "cancel_soft", type: "block", label: "Hủy" }} onClick={() => handleNodeClick("cancel")} active={activeNode === "cancel"} />
                    </div>
                  </div>
                </div>

                {/* Hard lock */}
                <div className="flex flex-col items-stretch gap-1">
                  <div className="flex justify-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#fef2f2", color: MOMO_RED }}>Vượt · Hard</span>
                  </div>
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: MOMO_RED }} /></div>
                  <NodeBox node={{ id: "hard_lock", type: "block", label: "Từ chối giao dịch", sub: "Chỉ khi Opt-in Hard Lock" }} onClick={() => handleNodeClick("hard_lock")} active={activeNode === "hard_lock"} />
                  <div className="flex justify-center"><div style={{ width: 1, height: 16, backgroundColor: MOMO_RED }} /></div>
                  <NodeBox node={{ id: "redirect_jar", type: "action", label: "Dùng Hũ khác?", sub: "Điều hướng nếu khẩn cấp" }} onClick={() => handleNodeClick("redirect_jar")} active={activeNode === "redirect_jar"} />
                  <div className="flex items-start gap-1 mt-1">
                    <div className="flex flex-col items-stretch gap-1">
                      <div className="flex justify-center"><span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: GREEN_LIGHT, color: GREEN }}>✓</span></div>
                      <div className="flex justify-center"><div style={{ width: 1, height: 10, backgroundColor: GREEN }} /></div>
                      <NodeBox node={{ id: "payment_success_hard", type: "success", label: "Thanh toán" }} onClick={() => handleNodeClick("payment_success")} active={activeNode === "payment_success"} />
                    </div>
                    <div className="flex flex-col items-stretch gap-1">
                      <div className="flex justify-center"><span className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "#fef2f2", color: MOMO_RED }}>✗</span></div>
                      <div className="flex justify-center"><div style={{ width: 1, height: 10, backgroundColor: MOMO_RED }} /></div>
                      <NodeBox node={{ id: "cancel_hard", type: "block", label: "Hủy" }} onClick={() => handleNodeClick("cancel")} active={activeNode === "cancel"} />
                    </div>
                  </div>
                </div>
              </div>

              <Arrow color="#94a3b8" label="merge — thành công" />
            </div>

            {/* ─── PHASE 4 ─── */}
            <PhaseHeader phase={phases[3]} />
            <div className="flex flex-col items-center gap-1 px-2">
              <div className="flex flex-col items-stretch gap-1">
                <NodeBox node={{ id: "payment_success", type: "success", label: "Màn hình Thanh toán Thành công", sub: "Hiển thị số tiền, người nhận, thời gian" }} onClick={() => handleNodeClick("payment_success")} active={activeNode === "payment_success"} />
                <Arrow color={GREEN} />
                <NodeBox node={{ id: "pill_tag", type: "action", label: "Pill Tags — Gắn nhãn tùy chọn", sub: "Chỉ xuất hiện với giao dịch cá nhân (20%). 1 chạm hoặc bỏ qua." }} onClick={() => handleNodeClick("pill_tag")} active={activeNode === "pill_tag"} />
                <Arrow color={GREEN} />
                <NodeBox node={{ id: "update_jar", type: "action", label: "Cập nhật số dư Hũ Chi Tiêu", sub: "Real-time. Thông báo nếu gần đạt hạn mức." }} onClick={() => handleNodeClick("update_jar")} active={activeNode === "update_jar"} />
                <Arrow color={GREEN} />
                <NodeBox node={{ id: "view_report", type: "process", label: "Xem báo cáo Hũ (tùy chọn)", sub: "Biểu đồ, so sánh hạn mức, gợi ý AI" }} onClick={() => handleNodeClick("view_report")} active={activeNode === "view_report"} />
                <Arrow color="#0f0f1a" />
                <NodeBox node={{ id: "end", type: "end", label: "Kết thúc" }} onClick={() => handleNodeClick("end")} active={activeNode === "end"} />
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {detail ? (
                <div
                  className="rounded-2xl border p-5 transition-all duration-300"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3
                      className="font-bold text-base leading-snug"
                      style={{ color: "#0f0f1a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {detail.title}
                    </h3>
                    <button
                      onClick={() => setActiveNode(null)}
                      className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: GRAY }}>
                    {detail.description}
                  </p>
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: GRAY_LIGHT }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: GRAY }}>
                      Chi tiết
                    </div>
                    <ul className="space-y-2">
                      {detail.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug" style={{ color: "#374151" }}>
                          <span style={{ color: MOMO_RED, marginTop: 2 }}>•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl border p-6 text-center"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "rgba(0,0,0,0.07)",
                    borderStyle: "dashed",
                  }}
                >
                  <div className="text-3xl mb-3"></div>
                  <p className="text-sm font-medium" style={{ color: "#374151", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Nhấp vào một bước trong sơ đồ
                  </p>
                  <p className="text-xs mt-1" style={{ color: GRAY }}>
                    để xem mô tả chi tiết hành động
                  </p>

                  {/* Quick stats */}
                  <div className="mt-6 space-y-3 text-left">
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: GRAY }}>
                      Tổng quan
                    </div>
                    {[
                      { label: "Giai đoạn", value: "4", color: MOMO_RED },
                      { label: "Bước trong luồng", value: "17+", color: BLUE },
                      { label: "Auto-phân loại", value: "80%", color: GREEN },
                      { label: "Cần gắn tag thủ công", value: "20%", color: ORANGE },
                      { label: "Chế độ Lock", value: "2 (Soft / Hard)", color: "#7c3aed" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: GRAY }}>
                          {s.label}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${s.color}18`, color: s.color }}
                        >
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase index */}
              <div className="mt-4 space-y-2">
                {phases.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: p.bg, border: `1px solid ${p.color}22` }}
                  >
                    <span className="text-xs font-bold" style={{ color: p.color }}>{p.id}</span>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: p.color }}>
                        GĐ {p.id}
                      </div>
                      <div className="text-xs" style={{ color: "#374151" }}>
                        {p.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
