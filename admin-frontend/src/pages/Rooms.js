import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRooms,
  togglePinRoom,
  toggleRoomActive,
  deleteRoom,
} from "../store/rooms/action";
import Pagination from "./Pagination";
import socket from "../util/socket";
import { warning } from "../util/Alert";

const ROOM_TYPES = ["All", "NormalLive", "AudioLive", "PkLive", "PkRequest"];

const Rooms = () => {
  const dispatch = useDispatch();

  const [type, setType] = useState("All");
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { rooms, total } = useSelector((state) => state.roomReducer);

  const start = (activePage - 1) * rowsPerPage;

  const fetchRooms = useCallback(() => {
    dispatch(
      getRooms({
        type,
        start,
        limit: rowsPerPage,
      }),
    );
  }, [dispatch, type, start, rowsPerPage]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    socket.on("roomDeleted", () => fetchRooms());

    return () => {
      socket.off("roomDeleted");
    };
  }, [fetchRooms]);

  const handleDeleteRoom = (roomId) => {
    warning().then((ok) => {
      if (ok) {
        dispatch(deleteRoom(roomId));
      }
    });
  };

  const getRoomType = (room) => {
    if (room.isPkMode) return "PkLive";
    if (room.audio) return "AudioLive";
    return "NormalLive";
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const getLiveDuration = (room) => {
    if (
      !room.liveStreaming ||
      !room.liveStreaming.startTime ||
      !room.liveStreaming.endTime
    )
      return "-";

    const start = new Date(room.liveStreaming.startTime);
    const end = new Date(room.liveStreaming.endTime);
    const diffMs = end - start;
    if (diffMs <= 0) return "00:00:00";

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Convert hours > 24 into days
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return `${days > 0 ? days + "d " : ""}${remainingHours}h ${minutes}m ${seconds}s`;
  };
  return (
    <div className="card-body card-overflow">
      {/* Type Filter */}
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setActivePage(1);
          }}
        >
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="table table-striped">
        <thead className="text-center">
          <tr>
            <th>No.</th>
            <th>Room</th>
            <th>Type</th>
            <th>Host</th>
            <th>Views</th>
            <th>Coins</th>
            <th>Audio</th>
            <th>PK</th>
            <th>Duration</th>
            <th>Pinned</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rooms?.length > 0 ? (
            rooms.map((room, index) => (
              <tr key={index}>
                <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                <td className="d-flex align-items-center">
                  <img
                    src={room.roomImage}
                    alt="room"
                    height="45"
                    width="45"
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-2">{room.roomName}</span>
                </td>

                <td>{getRoomType(room)}</td>

                {/* Host */}
                <td className="d-flex align-items-center justify-content-center">
                  <img
                    src={room.image}
                    alt="host"
                    height="35"
                    width="35"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-2">{room.name}</span>
                </td>

                <td>{room.view}</td>
                <td className="text-success">{room.rCoin}</td>

                <td>
                  {room.audio ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>

                <td>
                  {room.isPkMode ? (
                    <span className="badge bg-warning">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>
                <td>{getLiveDuration(room)}</td>

                <td>
                  {room.isPined ? (
                    <span className="badge bg-success">Pinned</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>

                <td>{new Date(room.createdAt).toLocaleDateString()}</td>

                {/* Action */}
                <td>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    {/* Pin / Unpin */}
                    <button
                      className={`btn btn-sm ${room.isPined ? "btn-danger" : "btn-primary"}`}
                      onClick={() => dispatch(togglePinRoom(room._id))}
                    >
                      {room.isPined ? "Unpin" : "Pin"}
                    </button>

                    {/* ON / OFF */}
                    <button
                      className={`btn btn-sm ${room.isActive ? "btn-success" : "btn-secondary"}`}
                      onClick={() => dispatch(toggleRoomActive(room._id))}
                    >
                      {room.isActive ? "ON" : "OFF"}
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRoom(room._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" align="center">
                Nothing to show!!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        activePage={activePage}
        rowsPerPage={rowsPerPage}
        userTotal={total}
        handleRowsPerPage={handleRowsPerPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Rooms;
