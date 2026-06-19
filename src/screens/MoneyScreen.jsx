import React, { useState } from "react";
import { Send, X } from "lucide-react";

export default function MoneyScreen({ store }) {
  const invoices = store.state.invoices || [];
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [activeFollowUpId, setActiveFollowUpId] = useState(null);
  const [copied, setCopied] = useState(false);

  function addInvoice(e) {
    e.preventDefault();
    if (!client.trim() || !category.trim() || !dueDate || !amount) return;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      client: client.trim(),
      category: category.trim(),
      dueDate,
      amountSimulated: parseFloat(amount),
      status
    };

    store.update("invoices", [...invoices, newInvoice]);
    setClient("");
    setCategory("");
    setDueDate("");
    setAmount("");
    setStatus("Pending");
  }

  function cycleStatus(id) {
    const updated = invoices.map((inv) => {
      if (inv.id !== id) return inv;
      const nextStatus =
        inv.status === "Pending" ? "Sent" : inv.status === "Sent" ? "Paid" : "Pending";
      return { ...inv, status: nextStatus };
    });
    store.update("invoices", updated);
  }

  function deleteInvoice(id) {
    store.update(
      "invoices",
      invoices.filter((inv) => inv.id !== id)
    );
    if (activeFollowUpId === id) setActiveFollowUpId(null);
  }

  const activeInvoice = invoices.find((inv) => inv.id === activeFollowUpId);
  const followUpTemplate = activeInvoice
    ? `Hi ${activeInvoice.client},

I hope you're doing well. This is a friendly reminder that invoice ${activeInvoice.id} for ${activeInvoice.category} ($${activeInvoice.amountSimulated}) was due on ${activeInvoice.dueDate} and is currently outstanding. 

Please let me know if you have any questions or need the payment link resent.

Best regards,
Sharavan`
    : "";

  function copyFollowUp() {
    if (!followUpTemplate) return;
    navigator.clipboard.writeText(followUpTemplate).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Calculate status sums
  const totalPaid = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + (inv.amountSimulated || 0), 0);
  const totalSent = invoices
    .filter((inv) => inv.status === "Sent")
    .reduce((sum, inv) => sum + (inv.amountSimulated || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + (inv.amountSimulated || 0), 0);
  const grandTotal = totalPaid + totalSent + totalPending || 1;

  const pctPaid = (totalPaid / grandTotal) * 100;
  const pctSent = (totalSent / grandTotal) * 100;
  const pctPending = (totalPending / grandTotal) * 100;

  // Deadline calculator
  const todayStr = new Date().toISOString().split("T")[0];
  const unpaidInvoices = invoices
    .filter((inv) => inv.status !== "Paid")
    .map((inv) => {
      const diffTime = new Date(inv.dueDate) - new Date(todayStr);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let label = "Upcoming";
      let tagTone = "teal";
      if (diffDays < 0) {
        label = "OVERDUE";
        tagTone = "red";
      } else if (diffDays <= 7) {
        label = "DUE SOON";
        tagTone = "clay";
      }
      return { ...inv, diffDays, label, tagTone };
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <section className="screen build-grid money-screen-layout">
      {/* Invoice list */}
      <div className="panel-large invoice-board">
        <span className="eyebrow">Interactive Shelf</span>
        <h2>Invoice & Payment Reminders</h2>
        <p>Track business transactions and schedule follow-ups without exposing bank balances.</p>

        <div className="invoice-list-container">
          {invoices.length === 0 ? (
            <p className="auth-notice">No invoice reminders found. Add one below.</p>
          ) : (
            <div className="invoice-table">
              <div className="table-header-row">
                <span>Client / Category</span>
                <span>Due Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {invoices.map((inv) => (
                <div key={inv.id} className="table-data-row">
                  <div>
                    <strong>{inv.client}</strong>
                    <small>{inv.category}</small>
                  </div>
                  <span>{inv.dueDate}</span>
                  <strong>${inv.amountSimulated}</strong>
                  <button
                    onClick={() => cycleStatus(inv.id)}
                    className={`status-pill-btn tone-${
                      inv.status === "Paid" ? "green" : inv.status === "Sent" ? "clay" : "teal"
                    }`}
                    title="Click to cycle status"
                  >
                    {inv.status}
                  </button>
                  <div className="row-actions">
                    {inv.status !== "Paid" && (
                      <button
                        onClick={() => {
                          setActiveFollowUpId(inv.id);
                          setCopied(false);
                        }}
                        className="follow-up-action-btn"
                        title="Generate follow-up"
                      >
                        <Send size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="delete-action-btn"
                      title="Delete reminder"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to Add Invoice */}
        <form onSubmit={addInvoice} className="add-invoice-form">
          <h3>Add Invoice Reminder</h3>
          <div className="form-grid">
            <input
              placeholder="Client Name"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
            />
            <input
              placeholder="Category / Project"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
            </select>
            <button type="submit" className="primary-button add-btn">
              Add Reminder
            </button>
          </div>
        </form>
      </div>

      {/* Side details */}
      <div className="panel-large money-summary-panel">
        <span className="eyebrow">Status Ratios</span>
        <h2>Revenue Status Breakdown</h2>

        <div className="ratio-meter-section">
          <div className="ratio-labels">
            <span className="tone-green">Paid: ${totalPaid}</span>
            <span className="tone-clay">Sent: ${totalSent}</span>
            <span className="tone-teal">Pending: ${totalPending}</span>
          </div>
          <div className="multi-ratio-bar">
            <div
              className="ratio-segment segment-paid"
              style={{ width: `${pctPaid}%`, background: "var(--green)" }}
              title={`Paid: ${Math.round(pctPaid)}%`}
            />
            <div
              className="ratio-segment segment-sent"
              style={{ width: `${pctSent}%`, background: "var(--clay)" }}
              title={`Sent: ${Math.round(pctSent)}%`}
            />
            <div
              className="ratio-segment segment-pending"
              style={{ width: `${pctPending}%`, background: "var(--teal)" }}
              title={`Pending: ${Math.round(pctPending)}%`}
            />
          </div>
        </div>

        {/* Deadlines Timeline */}
        <div className="deadlines-timeline-section">
          <h3>Upcoming Deadlines</h3>
          {unpaidInvoices.length === 0 ? (
            <p className="auth-notice">No outstanding invoices. Good job!</p>
          ) : (
            <div className="deadline-timeline-list">
              {unpaidInvoices.map((inv) => (
                <div key={inv.id} className="deadline-row-item">
                  <span className={`tag tone-${inv.tagTone}`}>{inv.label}</span>
                  <div>
                    <strong>{inv.client}</strong>
                    <span>
                      Due: {inv.dueDate} (
                      {inv.diffDays < 0
                        ? `${Math.abs(inv.diffDays)}d overdue`
                        : inv.diffDays === 0
                        ? "due today"
                        : `${inv.diffDays}d left`}
                      )
                    </span>
                  </div>
                  <strong>${inv.amountSimulated}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Follow up generator */}
        {activeInvoice && (
          <div className="follow-up-generator-panel">
            <div className="generator-title">
              <h3>Follow-up Template</h3>
              <button onClick={() => setActiveFollowUpId(null)} className="close-gen-btn">
                <X size={14} />
              </button>
            </div>
            <textarea readOnly value={followUpTemplate} className="follow-up-textbox" />
            <button
              type="button"
              onClick={copyFollowUp}
              className="secondary-button copy-template-btn"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
