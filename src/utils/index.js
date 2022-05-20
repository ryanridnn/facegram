export const calculateTimespan = (time) => {
  const timespan = Math.round(new Date(Date.now() - time) / 1000);

  if (timespan / 60 < 1) {
    return timespan + "s";
  } else if (timespan / 3600 < 1) {
    return Math.round(timespan / 60) + "m";
  } else if (timespan / (3600 * 24) < 1) {
    return Math.round(timespan / 3600) + "h";
  } else if (timespan / (3600 * 24 * 30) < 1) {
    return Math.round(timespan / (3600 * 24)) + "d";
  } else if (timespan / (3600 * 24 * 30 * 12 < 1)) {
    return Math.round(timespan / (3600 * 24 * 30)) + "mo";
  } else {
    return Math.round(timespan / (3600 * 24 * 30 * 12)) + "y";
  }
};

export const getSnapshotData = (snapshot) =>
  snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .map((doc) => ({ ...doc, postedAt: doc.postedAt?.toDate() || new Date() }));
