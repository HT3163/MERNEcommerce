import React, { Fragment, useEffect, useState, useRef } from "react";
import "./newProduct.css";           // reuse the shared form styles
import "./updateProduct.css";        // update-specific overrides
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiAlignLeft,
  FiUploadCloud,
  FiX,
  FiArrowLeft,
  FiSave,
  FiImage,
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

const UpdateProduct = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const params    = useParams();
  const alert     = useAlert();
  const dropRef   = useRef(null);

  const { error, product }                         = useSelector((s) => s.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector((s) => s.product);

  const [name,          setName]          = useState("");
  const [price,         setPrice]         = useState("");
  const [description,   setDescription]   = useState("");
  const [category,      setCategory]      = useState("");
  const [Stock,         setStock]         = useState("");
  const [images,        setImages]        = useState([]);
  const [oldImages,     setOldImages]     = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [dragOver,      setDragOver]      = useState(false);

  const productId = params.id;

  /* ── Seed form with existing product data ────────────────── */
  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product) {
      setName(product.name        || "");
      setDescription(product.description || "");
      setPrice(product.price      || "");
      setCategory(product.category   || "");
      setStock(product.Stock      || 0);
      setOldImages(product.images    || []);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Product updated successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, isUpdated, productId, product, updateError]);

  /* ── Image helpers ───────────────────────────────────────── */
  const processFiles = (files) => {
    const fileArr = Array.from(files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);           // replacing existing images

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

  const removeNewImage = (index) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev)        => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
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

    dispatch(updateProduct(productId, myForm));
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="Update Product — Admin" />

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
                <h1>Update Product</h1>
                <p>Edit product details and save changes</p>
              </div>
            </div>
            <div className="np-topbar-right">
              <button
                type="submit"
                form="up-form"
                className="np-submit-btn up-save-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="np-spinner" />
                ) : (
                  <FiSave size={16} />
                )}
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Form body ───────────────────────────────── */}
          <div className="np-body">
            <form
              id="up-form"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="np-form-grid"
            >

              {/* ══ LEFT COLUMN — Product details ════════ */}
              <div className="np-col-left">
                <div className="np-card">
                  <div className="np-card-header">
                    <p className="np-card-eyebrow">Basic Info</p>
                    <h3 className="np-card-title">Product Details</h3>
                  </div>

                  <div className="np-card-body">

                    {/* Name */}
                    <div className="np-field-group">
                      <label className="np-label" htmlFor="up-name">
                        Product Name <span className="np-required">*</span>
                      </label>
                      <div className="np-input-wrap">
                        <span className="np-input-icon"><FiPackage size={15} /></span>
                        <input
                          id="up-name"
                          type="text"
                          className="np-input"
                          placeholder="e.g. Premium Wireless Headphones"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Price + Stock */}
                    <div className="np-field-row">
                      <div className="np-field-group">
                        <label className="np-label" htmlFor="up-price">
                          Price <span className="np-required">*</span>
                        </label>
                        <div className="np-input-wrap">
                          <span className="np-input-icon"><FiDollarSign size={15} /></span>
                          <input
                            id="up-price"
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
                        <label className="np-label" htmlFor="up-stock">
                          Stock <span className="np-required">*</span>
                        </label>
                        <div className="np-input-wrap">
                          <span className="np-input-icon"><FiLayers size={15} /></span>
                          <input
                            id="up-stock"
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
                      <label className="np-label" htmlFor="up-category">
                        Category <span className="np-required">*</span>
                      </label>
                      <div className="np-input-wrap">
                        <span className="np-input-icon"><FiTag size={15} /></span>
                        <select
                          id="up-category"
                          className="np-input np-select"
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="">Select a category…</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="np-field-group">
                      <label className="np-label" htmlFor="up-description">
                        Description
                      </label>
                      <div className="np-input-wrap np-input-wrap--textarea">
                        <span className="np-input-icon np-input-icon--top">
                          <FiAlignLeft size={15} />
                        </span>
                        <textarea
                          id="up-description"
                          className="np-input np-textarea"
                          placeholder="Describe the product…"
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

                    {/* Current (saved) images */}
                    {oldImages && oldImages.length > 0 && (
                      <div className="up-current-images">
                        <p className="up-images-label">
                          <FiImage size={13} /> Current images
                        </p>
                        <div className="np-preview-grid">
                          {oldImages.map((img, idx) => (
                            <div key={idx} className="np-preview-item">
                              <img src={img.url} alt={`Product ${idx + 1}`} />
                              <button
                                type="button"
                                className="np-preview-remove"
                                onClick={() => removeOldImage(idx)}
                                title="Remove image"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New images preview */}
                    {imagesPreview.length > 0 && (
                      <div className="up-current-images">
                        <p className="up-images-label up-images-label--new">
                          <FiUploadCloud size={13} /> New images (replacing current)
                        </p>
                        <div className="np-preview-grid">
                          {imagesPreview.map((src, idx) => (
                            <div key={idx} className="np-preview-item">
                              <img src={src} alt={`New ${idx + 1}`} />
                              <button
                                type="button"
                                className="np-preview-remove"
                                onClick={() => removeNewImage(idx)}
                                title="Remove image"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Drop zone */}
                    <div
                      ref={dropRef}
                      className={`np-dropzone${dragOver ? " np-dropzone--active" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("up-file-input").click()}
                    >
                      <input
                        id="up-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInput}
                        style={{ display: "none" }}
                      />
                      <div className="np-dropzone-icon">
                        <FiUploadCloud size={26} />
                      </div>
                      <p className="np-dropzone-heading">
                        Replace images —{" "}
                        <span className="np-dropzone-link">browse</span>
                      </p>
                      <p className="np-dropzone-sub">PNG, JPG, WEBP</p>
                    </div>

                  </div>
                </div>

                {/* Tips card */}
                <div className="np-card np-tips-card">
                  <div className="np-card-body">
                    <p className="np-tips-title">💡 Tips</p>
                    <ul className="np-tips-list">
                      <li>Uploading new images replaces all current ones.</li>
                      <li>Use the ✕ button to remove individual current images.</li>
                      <li>Price and stock changes take effect immediately after saving.</li>
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

export default UpdateProduct;
