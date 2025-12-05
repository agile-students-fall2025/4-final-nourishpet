import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/HomePage.css';
import Footer from '../components/Footer';
import { API } from "../api";

function EditRecord() {
    const { id } = useParams();

    const [items, setItems] = useState([]);
    const [recordDate, setRecordDate] = useState("");
    const [recordId, setRecordId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false); //handle delete confirmation
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const fmt = (n) => {
        const v = Number(n);
        return Number.isFinite(v) ? v.toFixed(1) : "0";
    };

    useEffect(() => {
        const token = getToken();
        let fetchPromise;

        if (id === 'today') {
            fetchPromise = axios.get(`${API}/api/home/nutrition`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } else {
            fetchPromise = axios.get(`${API}/api/histdata`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        fetchPromise
            .then(res => {
                let specificRecord;
                if (id === 'today') {
                    specificRecord = res.data;
                } else {
                    const allRecords = res.data;
                    specificRecord = allRecords.find(item =>
                        String(item._id) === String(id) || item.date === id
                    );
                }

                if (specificRecord) {
                    setRecordDate(specificRecord.date);
                    setRecordId(specificRecord._id);

                    // Combine parallel arrays into a list of objects
                    const foods = specificRecord.food_list || [];
                    const grams = specificRecord.grams || [];
                    const protein = specificRecord.protein_list || [];
                    const carbs = specificRecord.carbs_list || [];
                    const fat = specificRecord.fat_list || [];

                    const combinedItems = foods.map((food, i) => ({
                        name: food,
                        grams: grams[i] || 0,
                        protein: protein[i] || 0,
                        carbs: carbs[i] || 0,
                        fat: fat[i] || 0
                    }));

                    setItems(combinedItems);
                } else {
                    setError("Record not found.");
                }
            })
            .catch(err => {
                console.error("Error loading:", err);
                setError("Failed to load data.");
            })
            .finally(() => setLoading(false));

    }, [id]);

    const initiateDelete = (index) => {
        setDeleteIndex(index);
        setShowConfirm(true);  // show confirmation popup
    };

    const confirmDelete = async () => {
        if (deleteIndex === null) return;

        setIsSaving(true);

        const newItems = items.filter((_, index) => index !== deleteIndex);

        const newTotalIntake = newItems.reduce((acc, curr) => acc + (curr.protein * 4) + (curr.carbs * 4) + (curr.fat * 9), 0);
        const newProtein = newItems.reduce((acc, curr) => acc + curr.protein, 0);
        const newCarbs = newItems.reduce((acc, curr) => acc + curr.carbs, 0);
        const newFat = newItems.reduce((acc, curr) => acc + curr.fat, 0);

        const payload = {
            _id: recordId,
            date: recordDate,
            food_list: newItems.map(i => i.name),
            grams: newItems.map(i => i.grams),
            protein_list: newItems.map(i => i.protein),
            carbs_list: newItems.map(i => i.carbs),
            fat_list: newItems.map(i => i.fat),
            total_intake: newTotalIntake,
            protein: newProtein,
            carbs: newCarbs,
            fat: newFat
        };

        // Send to the backend endpoint
        try {
            const token = getToken();

            const endpoint = `${API}/api/update_record`;

            await axios.post(endpoint, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setItems(newItems);
            setShowConfirm(false);
            setDeleteIndex(null);

        } catch (err) {
            console.error("Failed to delete:", err);
            alert(`Fail to save change: ${err.response?.data?.message || err.message}`);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setDeleteIndex(null);
    }

    if (loading) return <div className="homepage">Loading...</div>;
    if (error) return <div className="homepage">{error}</div>;

    return (
        <div className="homepage">
            <header className="homepage-header">
                <Link to="/archives" className="user-button">
                    Back
                </Link>
            </header>

            <main className="homepage-main">
                <h2>Editing: {recordDate}</h2>

                <div className="food-details">
                    <table className="food-table">
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan="2">No food items found.</td></tr>
                            ) : (
                                items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="food-name">
                                            <span>{item.name}</span>
                                            <br />
                                            <span>
                                                {fmt(item.grams)}g | P:{fmt(item.protein)} C:{fmt(item.carbs)} F:{fmt(item.fat)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => initiateDelete(index)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {showConfirm && (
                    <div className="popup-overlay" role="dialog" aria-modal="true">
                        <div className="popup-card">
                            <h3>Sure to delete <b>{items[deleteIndex]?.name}</b>?</h3>

                            <div className="popup-actions">
                                <button
                                    className="popup-btn cancel-btn"
                                    onClick={cancelDelete}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="popup-btn confirm-btn"
                                    onClick={confirmDelete}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Deleting..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default EditRecord;