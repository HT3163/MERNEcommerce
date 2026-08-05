import React, { Fragment, useEffect, useState, useRef } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiAlignLeft,
  FiUploadCloud,
  FiX,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const NewProduct = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const alert     = useAlert();
  const dropRef   = useRef(null);

  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name,           setName]           = useState("");
  const [price,          setPrice]          = useState("");
  const [description,    setDescription]    = useState("");
  const [category,       setCategory]       = useState("");
  const [Stock,          setStock]          = useState("");
  const [images,         setImages]         = useState([]);
  const [imagesPreview,  setImagesPreview]  = useState([]);
  const [dragOver,       setDragOver]       = useState(false);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Product created successfully");
      navigate("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, success]);

  /* ── Image helpers ───────────────────────────────────────── */
  const processFiles = (files) => {
    const fileArr = Array.from(files);
    setImages([]);
    setImagesPreview([]);

    fileArr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
          setImages((prev)        => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const removeImage = (index) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev)        => prev.filter((_, i) => i !== index));
  };

  /* Drag-and-drop */
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true);  };
  const handleDragLeave = ()  => setDragOver(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name",        name);
    myForm.set("price",       price);
    myForm.set("description", description);
    myForm.set("category",    category);
    myForm.set("Stock",       Stock);
    images.forEach((img) => myForm.append("images", img));

    dispatch(createProduct(myForm));
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="Create Product — Admin" />

      <div className="np-layout">
        <SideBar />

        <div className="np-main">

          {/* ── Sticky top bar ──────────────────────────── */}
          <div className="np-topbar">
            <div className="np-topbar-left">
              <button
                type="button"
                className="np-back-btn"
                onClick={() => navigate("/admin/products")}
              >
                <FiArrowLeft size={15} />
              </button>
              <div>
                <h1>Create Product</h1>
                <p>Add a new product to your catalogue</p>
              </div>
            </div>
            <div className="np-topbar-right">
              <button
                type="submit"
                form="np-form"
                className="np-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="np-spinner" />
                ) : (
                  <FiCheckCircle size={16} />
                )}
                {loading ? "Publishing…" : "Publish Product"}
              </button>
            </div>
          </div>

          {/* ── Form body ───────────────────────────────── */}
          <div className="np-body">
            <form
              id="np-form"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="np-form-grid"
            >

              {/* ══ LEFT COLUMN — Product details ════════ */}
              <div className="np-col-left">

                {/* Basic info card */}
                <div className="np-card">
                  <div className="np-card-header">
                    <p className="np-card-eyebrow">Basic Info</p>
                    <h3 className="np-card-title">Product Details</h3>
                  </div>

                  <div className="np-card-body">
                    {/* Name */}
                    <div className="np-field-group">
                      <label className="np-label" htmlFor="np-name">
                        Product Name <span className="np-required">*</span>
                      </label>
                      <div className="np-input-wrap">
                        <span className="np-input-icon">
                          <FiPackage size={15} />
                        </span>
                        <input
                          id="np-name"
                          type="text"
                          className="np-input"
                          placeholder="e.g. Premium Wireless Headphones"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Price + Stock — side by side */}
                    <div className="np-field-row">
                      <div className="np-field-group">
                        <label className="np-label" htmlFor="np-price">
                          Price <span className="np-required">*</span>
                        </label>
                        <div className="np-input-wrap">
                          <span className="np-input-icon">
                            <FiDollarSign size={15} />
                          </span>
                          <input
                            id="np-price"
                            type="number"
                            className="np-input"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="np-field-group">
                        <label className="np-label" htmlFor="np-stock">
                          Stock <span className="np-required">*</span>
                        </label>
                        <div className="np-input-wrap">
                          <span className="np-input-icon">
                            <FiLayers size={15} />
                          </span>
                          <input
                            id="np-stock"
                            type="number"
                            className="np-input"
                            placeholder="0"
                            min="0"
                            required
                            value={Stock}
                            onChange={(e) => setStock(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="np-field-group">
                      <label className="np-label" htmlFor="np-category">
                        Category <span className="np-required">*</span>
                      </label>
                      <div className="np-input-wrap">
                        <span className="np-input-icon">
                          <FiTag size={15} />
                        </span>
                        <select
                          id="np-category"
                          className="np-input np-select"
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="">Select a category…</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="np-field-group">
                      <label className="np-label" htmlFor="np-description">
                        Description
                      </label>
                      <div className="np-input-wrap np-input-wrap--textarea">
                        <span className="np-input-icon np-input-icon--top">
                          <FiAlignLeft size={15} />
                        </span>
                        <textarea
                          id="np-description"
                          className="np-input np-textarea"
                          placeholder="Describe the product — features, materials, dimensions…"
                          rows={5}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>{/* /np-col-left */}

              {/* ══ RIGHT COLUMN — Media ═════════════════ */}
              <div className="np-col-right">

                {/* Image upload card */}
                <div className="np-card">
                  <div className="np-card-header">
                    <p className="np-card-eyebrow">Media</p>
                    <h3 className="np-card-title">Product Images</h3>
                  </div>

                  <div className="np-card-body">
                    {/* Drop zone */}
                    <div
                      ref={dropRef}
                      className={`np-dropzone${dragOver ? " np-dropzone--active" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("np-file-input").click()}
                    >
                      <input
                        id="np-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInput}
                        style={{ display: "none" }}
                      />
                      <div className="np-dropzone-icon">
                        <FiUploadCloud size={28} />
                      </div>
                      <p className="np-dropzone-heading">
                        Drop images here or{" "}
                        <span className="np-dropzone-link">browse</span>
                      </p>
                      <p className="np-dropzone-sub">
                        PNG, JPG, WEBP — up to 5 files
                      </p>
                    </div>

                    {/* Preview grid */}
                    {imagesPreview.length > 0 && (
                      <div className="np-preview-grid">
                        {imagesPreview.map((src, idx) => (
                          <div key={idx} className="np-preview-item">
                            <img src={src} alt={`Preview ${idx + 1}`} />
                            <button
                              type="button"
                              className="np-preview-remove"
                              onClick={() => removeImage(idx)}
                              title="Remove image"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips card */}
                <div className="np-card np-tips-card">
                  <div className="np-card-body">
                    <p className="np-tips-title">💡 Tips</p>
                    <ul className="np-tips-list">
                      <li>Use square images for the best display.</li>
                      <li>Add at least 2–3 images from different angles.</li>
                      <li>Keep descriptions concise but informative.</li>
                      <li>Double-check stock before publishing.</li>
                    </ul>
                  </div>
                </div>

              </div>{/* /np-col-right */}

            </form>
          </div>{/* /np-body */}
        </div>{/* /np-main */}
      </div>{/* /np-layout */}
    </Fragment>
  );
};

export default NewProduct;
