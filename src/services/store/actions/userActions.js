import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth, googleProvider } from "../../firebase/config";

import { login, logout } from "../reducers/userSlice";

export const useAuthStateListener = (navigate) => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				dispatch(
					login({
						id: user.uid,
						name: user.displayName,
						photoURL: user.photoURL,
					})
				);
			} else {
				dispatch(logout());
			}
			setLoading(false);
		});

		return unsub;
	}, []);

	return loading;
};

export const firebaseLogin = async () => {
	const { user } = await signInWithPopup(auth, googleProvider);
	const userDoc = await getDoc(doc(db, "users", user.uid));
	const { displayName, photoURL } = auth.currentUser;
	if (!userDoc.exists()) {
		setDoc(doc(db, "users", user.uid), {
			fullname: displayName,
			photoURL,
			stats: {
				posts: 0,
				following: 0,
				followers: 0,
			},
		});
	}
};

export const firebaseLogout = () => {
	signOut(auth);
};

export const getUserData = (id, callback) => {
	const unsub = onSnapshot(doc(db, "users", id), (docSnap) => {
		const user = { id: docSnap.id, ...docSnap.data() };
		callback(user);
	});

	return unsub;
};

export const updateUser = async (id, obj) => {
	await updateDoc(doc(db, "users", id), obj);
};
