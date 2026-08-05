import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./userList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiShield,
  FiUser,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
} from "react-icons/fi";

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert    = useAlert();

  const [searchQuery, setSearchQuery] = useState("");

  const { error, users }                               = useSelector((s) => s.allUsers);
  const { error: deleteError, isDeleted, message }     = useSelector((s) => s.profile);

  const deleteUserHandler = (id) => {
    if (window.confirm("Delete this user? This cannot be undone.")) {
      dispatch(deleteUser(id));
    }
  };

  useEffect(() => {
    if (error)       { alert.error(error);       dispatch(clearErrors()); }
    if (deleteError) { alert.error(deleteError);  dispatch(clearErrors()); }
    if (isDeleted) {
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);

  /* ── Derived stats ───────────────────────────────────────── */
  const totalUsers  = users ? users.length : 0;
  const admins      = users ? users.filter((u) => u.role === "admin").length : 0;
  const regular     = totalUsers - admins;

  /* ── Role badge helper ───────────────────────────────────── */
  const RoleBadge = ({ role }) =>
    role === "admin" ? (
      <span className="ul-badge ul-badge-admin">
        <FiShield size={11} /> Admin
      </span>
    ) : (
      <span className="ul-badge ul-badge-user">
        <FiUser size={11} /> User
      </span>
    );

  /* ── Avatar initials helper ──────────────────────────────── */
  const Avatar = ({ name }) => {
    const initials = name
      ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "U";
    return <div className="ul-avatar">{initials}</div>;
  };

  /* ── DataGrid columns ───────────────────────────────────── */
  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="ul-user-id">{params.value}</span>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 0.6,
      renderCell: (params) => (
        <div className="ul-name-cell">
          <Avatar name={params.value} />
          <span className="ul-name">{params.value}</span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 220,
      flex: 0.8,
      renderCell: (params) => (
        <span className="ul-email">{params.value}</span>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      flex: 0.3,
      renderCell: (params) => <RoleBadge role={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 110,
      flex: 0.25,
      sortable: false,
      renderCell: (params) => {
        const id = params.getValue(params.id, "id");
        return (
          <div className="ul-actions">
            <Link
              to={`/admin/user/${id}`}
              className="ul-action-btn ul-action-edit"
              title="Edit user"
            >
              <FiEdit2 size={15} />
            </Link>
            <button
              className="ul-action-btn ul-action-delete"
              onClick={() => deleteUserHandler(id)}
              title="Delete user"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  /* ── Rows ────────────────────────────────────────────────── */
  const allRows = users
    ? users.map((u) => ({
        id:    u._id,
        name:  u.name,
        email: u.email,
        role:  u.role,
      }))
    : [];

  const rows = searchQuery.trim()
    ? allRows.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase())  ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.role.toLowerCase().includes(searchQuery.toLowerCase())  ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRows;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Fragment>
      <MetaData title="All Users — Admin" />

      <div className="ul-layout">
        <SideBar />

        <div className="ul-main">

          {/* ── Top bar ───────────────────────────────────── */}
          <div className="ul-topbar">
            <div className="ul-topbar-left">
              <h1>Users</h1>
              <p>Manage registered accounts and roles</p>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────── */}
          <div className="ul-body">

            {/* Stat cards */}
            <div className="ul-stats">
              <div className="ul-stat-card">
                <div className="ul-stat-icon" style={{ background: "#eef2ff" }}>
                  <FiUsers size={20} color="#6366f1" />
                </div>
                <div className="ul-stat-info">
                  <p className="ul-stat-label">Total Users</p>
                  <h2 className="ul-stat-value">{totalUsers}</h2>
                </div>
              </div>

              <div className="ul-stat-card">
                <div className="ul-stat-icon" style={{ background: "#fef3c7" }}>
                  <FiShield size={20} color="#d97706" />
                </div>
                <div className="ul-stat-info">
                  <p className="ul-stat-label">Admins</p>
                  <h2 className="ul-stat-value">{admins}</h2>
                </div>
              </div>

              <div className="ul-stat-card">
                <div className="ul-stat-icon" style={{ background: "#f0fdf4" }}>
                  <FiUserCheck size={20} color="#16a34a" />
                </div>
                <div className="ul-stat-info">
                  <p className="ul-stat-label">Regular Users</p>
                  <h2 className="ul-stat-value">{regular}</h2>
                </div>
              </div>
            </div>

            {/* Table card */}
            <div className="ul-table-card">
              <div className="ul-table-header">
                <div>
                  <p className="ul-table-eyebrow">Accounts</p>
                  <h3 className="ul-table-title">All Users</h3>
                </div>
                <div className="ul-search-wrap">
                  <FiSearch size={15} className="ul-search-icon" />
                  <input
                    type="text"
                    className="ul-search-input"
                    placeholder="Search by name, email or role…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                className="ul-datagrid"
                autoHeight
              />
            </div>

          </div>{/* /ul-body */}
        </div>{/* /ul-main */}
      </div>{/* /ul-layout */}
    </Fragment>
  );
};

export default UsersList;
