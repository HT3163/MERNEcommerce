import React, { Fragment, useEffect, useState } from "react";
import "./processOrder.css";
import MetaData from "../layout/MetaData";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiTag,
} from "react-icons/fi";

const ProcessOrder = () => {
  const navigate = useNavigate();
  const params   = useParams();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const { order, error, loading }              = useSelector((s) => s.orderDetails);
  const { error: updateError, isUpdated }      = useSelector((s) => s.order);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error)       { alert.error(error);       dispatch(clearErrors()); }
    if (updateError) { alert.error(updateError);  dispatch(clearErrors()); }
    if (isUpdated) {
      alert.success("Order updated successfully");
      navigate("/admin/orders");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, alert, error, params.id, navigate, isUpdated, updateError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(params.id, myForm));
  };

  /* ── Status helpers ──────────────────────────────────────── */
  const getStatusBadge = (s) => {
    const map = {
      Processing: { cls: "po-status-processing", icon: <FiClock size={12} /> },
      Shipped:    { cls: "po-status-shipped",    icon: <FiTruck size={12} /> },
      Delivered:  { cls: "po-status-delivered",  icon: <FiCheckCircle size={12} /> },
    };
    const cfg = map[s] || map.Processing;
    return (
      <span className={`po-status-badge ${cfg.cls}`}>
        {cfg.icon} {s || "Unknown"}
      </span>
    );
  };

  const getStatusStep = (s) => {
    if (s === "Delivered") return 3;
    if (s === "Shipped")   return 2;
    return 1;
  };

  const isDelivered = order?.orderStatus === "Delivered";
  const isPaid      = order?.paymentInfo?.status === "succeeded";

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="Process Order — Admin" />

      <div className="po-layout">
        <SideBar />

        <div className="po-main">

          {/* ── Top bar ───────────────────────────────────── */}
          <div className="po-topbar">
            <div className="po-topbar-left">
              <button
                type="button"
                className="po-back-btn"
                onClick={() => navigate("/admin/orders")}
              >
                <FiArrowLeft size={15} />
              </button>
              <div>
                <h1>Process Order</h1>
                <p className="po-order-id-sub">
                  Order&nbsp;
                  <span className="po-mono">#{params.id}</span>
                </p>
              </div>
            </div>

            {!isDelivered && (
              <div className="po-topbar-right">
                <button
                  type="submit"
                  form="po-form"
                  className="po-submit-btn"
                  disabled={loading || status === ""}
                >
                  {loading
                    ? <span className="po-spinner" />
                    : <FiSave size={15} />}
                  {loading ? "Saving…" : "Update Status"}
                </button>
              </div>
            )}
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          {loading ? (
            <div className="po-loader-wrap"><Loader /></div>
          ) : (
            <div className="po-body">
              <div className={`po-grid${isDelivered ? " po-grid--single" : ""}`}>

                {/* ══ LEFT — Order details ════════════════ */}
                <div className="po-col-left">

                  {/* Progress tracker */}
                  <div className="po-card">
                    <div className="po-card-header">
                      <p className="po-card-eyebrow">Fulfilment</p>
                      <h3 className="po-card-title">Order Progress</h3>
                    </div>
                    <div className="po-card-body">
                      <div className="po-tracker">
                        {["Processing", "Shipped", "Delivered"].map((step, idx) => {
                          const stepNum  = idx + 1;
                          const current  = getStatusStep(order?.orderStatus);
                          const done     = stepNum <= current;
                          const active   = stepNum === current;
                          return (
                            <React.Fragment key={step}>
                              <div className={`po-step${done ? " po-step--done" : ""}${active ? " po-step--active" : ""}`}>
                                <div className="po-step-dot">
                                  {done ? <FiCheckCircle size={14} /> : <span>{stepNum}</span>}
                                </div>
                                <span className="po-step-label">{step}</span>
                              </div>
                              {idx < 2 && (
                                <div className={`po-step-line${done && stepNum < current ? " po-step-line--done" : ""}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Shipping info */}
                  <div className="po-card">
                    <div className="po-card-header">
                      <p className="po-card-eyebrow">Logistics</p>
                      <h3 className="po-card-title">Shipping Info</h3>
                    </div>
                    <div className="po-card-body">
                      <div className="po-info-row">
                        <span className="po-info-icon"><FiUser size={14} /></span>
                        <div>
                          <p className="po-info-label">Customer</p>
                          <p className="po-info-value">{order?.user?.name || "—"}</p>
                        </div>
                      </div>
                      <div className="po-info-row">
                        <span className="po-info-icon"><FiPhone size={14} /></span>
                        <div>
                          <p className="po-info-label">Phone</p>
                          <p className="po-info-value">{order?.shippingInfo?.phoneNo || "—"}</p>
                        </div>
                      </div>
                      <div className="po-info-row">
                        <span className="po-info-icon"><FiMapPin size={14} /></span>
                        <div>
                          <p className="po-info-label">Address</p>
                          <p className="po-info-value">
                            {order?.shippingInfo
                              ? `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="po-card">
                    <div className="po-card-header">
                      <p className="po-card-eyebrow">Finance</p>
                      <h3 className="po-card-title">Payment</h3>
                    </div>
                    <div className="po-card-body">
                      <div className="po-info-row">
                        <span className="po-info-icon"><FiCreditCard size={14} /></span>
                        <div>
                          <p className="po-info-label">Status</p>
                          <span className={`po-pay-badge ${isPaid ? "po-pay-badge--paid" : "po-pay-badge--unpaid"}`}>
                            {isPaid ? <FiCheckCircle size={11} /> : <FiClock size={11} />}
                            {isPaid ? "Paid" : "Not Paid"}
                          </span>
                        </div>
                      </div>
                      <div className="po-info-row">
                        <span className="po-info-icon"><FiTag size={14} /></span>
                        <div>
                          <p className="po-info-label">Order Total</p>
                          <p className="po-info-value po-info-value--bold">
                            ${order?.totalPrice?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="po-card">
                    <div className="po-card-header">
                      <p className="po-card-eyebrow">Items</p>
                      <h3 className="po-card-title">
                        Order Items
                        <span className="po-items-count">
                          {order?.orderItems?.length || 0}
                        </span>
                      </h3>
                    </div>
                    <div className="po-items-list">
                      {order?.orderItems?.map((item) => (
                        <div key={item.product} className="po-item-row">
                          <div className="po-item-img">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="po-item-info">
                            <Link
                              to={`/product/${item.product}`}
                              className="po-item-name"
                            >
                              {item.name}
                            </Link>
                            <p className="po-item-sub">
                              {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <div className="po-item-total">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                          <FiChevronRight size={14} className="po-item-arrow" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>{/* /po-col-left */}

                {/* ══ RIGHT — Process form ════════════════ */}
                {!isDelivered && (
                  <div className="po-col-right">
                    <div className="po-card po-sticky-card">
                      <div className="po-card-header">
                        <p className="po-card-eyebrow">Action</p>
                        <h3 className="po-card-title">Update Status</h3>
                      </div>
                      <div className="po-card-body">

                        {/* Current status */}
                        <div className="po-current-status">
                          <p className="po-cs-label">Current Status</p>
                          {getStatusBadge(order?.orderStatus)}
                        </div>

                        <form id="po-form" onSubmit={handleSubmit}>
                          <div className="po-field-group">
                            <label className="po-label" htmlFor="po-status">
                              Move to <span className="po-required">*</span>
                            </label>
                            <div className="po-select-wrap">
                              <FiTruck size={15} className="po-select-icon" />
                              <select
                                id="po-status"
                                className="po-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                              >
                                <option value="">Choose next status…</option>
                                {order?.orderStatus === "Processing" && (
                                  <option value="Shipped">Shipped</option>
                                )}
                                {order?.orderStatus === "Shipped" && (
                                  <option value="Delivered">Delivered</option>
                                )}
                              </select>
                            </div>
                          </div>

                          {/* Submit — also in topbar, this one stays in card */}
                          <button
                            type="submit"
                            className="po-submit-btn po-submit-btn--full"
                            disabled={loading || status === ""}
                          >
                            {loading
                              ? <span className="po-spinner" />
                              : <FiSave size={15} />}
                            {loading ? "Saving…" : "Update Status"}
                          </button>
                        </form>

                        {/* Warning for last step */}
                        {order?.orderStatus === "Shipped" && (
                          <p className="po-warn">
                            ⚠️ Marking as <strong>Delivered</strong> is
                            irreversible. Confirm before proceeding.
                          </p>
                        )}

                      </div>
                    </div>
                  </div>
                )}{/* /po-col-right */}

              </div>{/* /po-grid */}
            </div>
          )}

        </div>{/* /po-main */}
      </div>{/* /po-layout */}
    </Fragment>
  );
};

export default ProcessOrder;
