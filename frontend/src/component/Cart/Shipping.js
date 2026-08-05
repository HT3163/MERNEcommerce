import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin, FiHome, FiMap, FiGlobe,
  FiPhone, FiUser, FiArrowRight,
} from "react-icons/fi";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert    = useAlert();
  const { shippingInfo } = useSelector((s) => s.cart);

  const [address,  setAddress]  = useState(shippingInfo.address  || "");
  const [city,     setCity]     = useState(shippingInfo.city      || "");
  const [state,    setState]    = useState(shippingInfo.state     || "");
  const [country,  setCountry]  = useState(shippingInfo.country  || "");
  const [pinCode,  setPinCode]  = useState(shippingInfo.pinCode  || "");
  const [phoneNo,  setPhoneNo]  = useState(shippingInfo.phoneNo  || "");

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNo.length !== 10) {
      alert.error("Phone number must be exactly 10 digits.");
      return;
    }
    dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));
    navigate("/order/confirm");
  };

  /* field config — icon, label, type, value, setter, required */
  const fields = [
    { icon: FiHome,   label: "Street Address", type: "text",   val: address, set: setAddress, req: true  },
    { icon: FiMap,    label: "City",            type: "text",   val: city,    set: setCity,    req: true  },
    { icon: FiMapPin, label: "Postal / Pin Code", type: "number", val: pinCode, set: setPinCode, req: true },
    { icon: FiPhone,  label: "Phone Number",   type: "number", val: phoneNo, set: setPhoneNo, req: true  },
  ];

  return (
    <Fragment>
      <MetaData title="Shipping Details — LUXE" />
      <CheckoutSteps activeStep={0} />

      <div
        className="min-h-screen flex items-start justify-center py-12 px-4"
        style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-full max-w-md ship-fade-up">

          {/* Card */}
          <div className="bg-white rounded-2xl p-8"
               style={{ border: "1px solid #f0f0f0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>

            {/* Header */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-widest mb-1"
                 style={{ color: "#6366f1" }}>
                Step 1 of 3
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif",
                           fontSize: "1.6rem", fontWeight: 700, color: "#0a0a0a" }}>
                Shipping Details
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Where should we deliver your order?
              </p>
            </div>

            <form onSubmit={shippingSubmit} className="flex flex-col gap-4">

              {/* Text / number fields */}
              {fields.map(({ icon: Icon, label, type, val, set, req }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                         style={{ letterSpacing: "0.04em" }}>
                    {label}
                  </label>
                  <div className="ship-field">
                    <span className="ship-field-icon"><Icon size={15} /></span>
                    <input
                      type={type}
                      className="ship-input"
                      placeholder={label}
                      value={val}
                      required={req}
                      onChange={(e) => set(e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                       style={{ letterSpacing: "0.04em" }}>
                  Country
                </label>
                <div className="ship-field">
                  <span className="ship-field-icon"><FiGlobe size={15} /></span>
                  <select
                    className="ship-select"
                    required
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setState(""); }}
                  >
                    <option value="">Select Country</option>
                    {Country.getAllCountries().map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State — only if country selected */}
              {country && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5"
                         style={{ letterSpacing: "0.04em" }}>
                    State / Province
                  </label>
                  <div className="ship-field">
                    <span className="ship-field-icon"><FiUser size={15} /></span>
                    <select
                      className="ship-select"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {State.getStatesOfCountry(country).map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="ship-submit-btn"
                disabled={!state}
              >
                Continue to Review
                <FiArrowRight size={15} />
              </button>
            </form>

            {/* Trust note */}
            <p className="text-center text-xs text-gray-400 mt-5">
              🔒 Your information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
