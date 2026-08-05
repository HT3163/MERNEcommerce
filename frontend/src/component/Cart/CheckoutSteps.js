import React from "react";
import "./CheckoutSteps.css";
import { FiTruck, FiCheckSquare, FiCreditCard } from "react-icons/fi";

const STEPS = [
  { label: "Shipping",        icon: FiTruck       },
  { label: "Confirm Order",   icon: FiCheckSquare },
  { label: "Payment",         icon: FiCreditCard  },
];

const CheckoutSteps = ({ activeStep }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "1.25rem 1rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="max-w-lg mx-auto flex items-center"
        style={{ position: "relative" }}
      >
        {STEPS.map((step, index) => {
          const done    = activeStep > index;
          const current = activeStep === index;
          const Icon    = step.icon;

          return (
            <React.Fragment key={index}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center" style={{ flex: "0 0 auto", zIndex: 1 }}>
                {/* Circle */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done
                      ? "#10b981"
                      : current
                      ? "#6366f1"
                      : "#f3f4f6",
                    border: current ? "2px solid #6366f1" : "2px solid transparent",
                    boxShadow: current ? "0 0 0 4px rgba(99,102,241,0.12)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <Icon size={16} color={current ? "#fff" : "#9ca3af"} />
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    marginTop: 6,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: done ? "#10b981" : current ? "#6366f1" : "#9ca3af",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: done ? "#10b981" : "#e5e7eb",
                    margin: "0 6px",
                    marginBottom: 20,
                    transition: "background 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
