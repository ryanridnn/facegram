import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

//components
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import ActionListPopup from "../ActionListPopup";
import Media from "./Media";
import Comment from "./Comment";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  sendComment,
  useLikeListener,
  likePost,
  useSavedListener,
  savePost,
} from "../../services/store/actions/postsActions";

import { auth } from "../../services/firebase/config";

import { deletePost } from "../../services/store/actions/postsActions";

import { calculateTimespan } from "../../utils";

// icons
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  AnnotationIcon as AnnotationIconSolid,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/solid";
import {
  HeartIcon as HeartIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  AnnotationIcon as AnnotationIconOutline,
  BanIcon,
  TrashIcon,
} from "@heroicons/react/outline";

const container = {
  hidden: {
    height: 0,
  },
  show: {
    height: "auto",
    transition: {
      duration: 0.6,
      ease: [0.04, 0.62, 0.23, 0.98],
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: -25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const PostCard = ({
  id,
  user: { id: userId, fullname, photoURL },
  desc,
  media,
  stats: { likes: likesCount, saves: savesCount, comments: commentsCount },
  postedAt,
}) => {
  const dispatch = useDispatch();
  const { id: selectedUserId } = useSelector(
    (state) => state.user.selectedUser
  );
  const liked = useLikeListener({
    posterId: userId,
    userId: auth.currentUser.uid,
    postId: id,
  });
  const [likeLoading, setLikeLoading] = useState(false);

  const saved = useSavedListener({
    posterId: userId,
    userId: auth.currentUser.uid,
    postId: id,
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const { comments: commentsData } = useSelector((state) => state.posts);

  const comments =
    commentsData?.find((data) => data.postId === id)?.comments || [];

  const [commentsOpened, setCommentsOpened] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);

  const [description, setDescription] = useState(desc);
  const [timespan, setTimespan] = useState(null);
  const [popupOpened, setPopupOpened] = useState(false);

  const commentInputRef = useRef();
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const actionList = [];

  if (userId === auth.currentUser.uid) {
    actionList.push({
      actionName: "Delete post",
      icon: TrashIcon,
      handler: () => deletePost(id, selectedUserId, dispatch),
    });
  }

  if (userId !== auth.currentUser.uid) {
    actionList.push({
      actionName: "Unfollow User",
      icon: BanIcon,
    });
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInputRef.current.value === "") return;

    setIsSubmittingComment(true);

    sendComment(
      commentInputRef.current.value,
      userId,
      id,
      dispatch,
      comments
    ).then(() => {
      setIsSubmittingComment(false);
    });

    commentInputRef.current.value = "";
  };

  useEffect(() => {
    setTimespan(calculateTimespan(postedAt));
  }, [postedAt]);

  useEffect(() => {
    if (comments.length && commentsOpened) {
      setIsCommentsLoading(false);
    } else if (!comments.length && commentsOpened) {
      fetchComments(userId, id, dispatch).then(() => {
        setIsCommentsLoading(false);
      });
    }
  }, [commentsOpened]);

  useEffect(() => {
    if (desc.length <= 200) setDescription(desc);
    else if (!expandDesc) setDescription(desc.slice(0, 200) + "...");
    else setDescription(desc);
  }, [expandDesc]);

  return (
    <div className="bg-white rounded-xl shadow text-sm sm:text-base">
      <div className="flex justify-between p-4 sm:px-6 sm:py-5">
        <div className="flex items-center">
          <Link
            to={`${process.env.PUBLIC_URL}/profile/${userId}`}
            className="flex items-center"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary overflow-hidden">
              <img src={photoURL} alt="user profile" className="w-full" />
            </div>
            <div className="font-medium ml-3 hover:underline">{fullname}</div>
          </Link>
          <div className="ml-3 text-[#555555]">{timespan} ago</div>
        </div>
        <div className="relative">
          <motion.button
            onClick={() => setPopupOpened(!popupOpened)}
            whileHover={{ scale: 1.25, transition: { duration: 0.15 } }}
            className="flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D9ECFF]"
          >
            <DotsHorizontalIcon className="w-4 sm:w-5 text-primary" />
          </motion.button>
          <ActionListPopup
            popupOpened={popupOpened}
            setPopupOpened={setPopupOpened}
            actionList={actionList}
          />
        </div>
      </div>
      <div className="bg-gray-100 px-4 py-5 sm:px-6 sm:py-6 font-sm">
        <span>{description}</span>
        <button
          className="text-primary ml-2"
          onClick={() => setExpandDesc(!expandDesc)}
        >
          {desc.length <= 200 ? "" : expandDesc ? "Show less" : "Read more"}
        </button>
      </div>
      <Media media={media} />
      <div>
        <div className="flex justify-between py-5 sm:py-6">
          <motion.button
            whileHover={{
              scale: 1.13,
              transition: { duration: 0.15 },
            }}
            className="flex-1 flex justify-center items-center text-sm sm:text-base"
            disabled={likeLoading}
            onClick={() =>
              likePost(
                { posterId: userId, userId: auth.currentUser.uid, postId: id },
                liked,
                setLikeLoading
              )
            }
          >
            {liked ? (
              <HeartIconSolid
                className={`h-5 sm:h-6 transition duration-300 linear ${
                  likeLoading ? "text-gray-400" : "text-[#E56363]"
                }`}
              />
            ) : (
              <HeartIconOutline
                className={`h-5 sm:h-6 transition duration-300 linear ${
                  likeLoading && "text-gray-400"
                }`}
              />
            )}
            <div
              className={`font-medium ml-2 transition duration-300 linear ${
                likeLoading ? "text-gray-400" : liked && "text-[#E56363]"
              }`}
            >
              {likesCount}
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.13, transition: { duration: 0.15 } }}
            className="flex-1 flex justify-center items-center text-sm sm:text-base"
            disabled={saveLoading}
            onClick={() =>
              savePost(
                {
                  posterId: userId,
                  userId: auth.currentUser.uid,
                  postId: id,
                },
                saved,
                setSaveLoading
              )
            }
          >
            {saved ? (
              <BookmarkIconSolid
                className={`h-5 sm:h-6 transition duration-300 linear ${
                  saveLoading && "text-gray-400"
                }`}
              />
            ) : (
              <BookmarkIconOutline
                className={`h-5 sm:h-6 transition duration-300 linear ${
                  saveLoading && "text-gray-400"
                }`}
              />
            )}
            <div
              className={`font-medium ml-2 transition duration-300 linear ${
                saveLoading && "text-gray-400"
              }`}
            >
              {savesCount}
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.13, transition: { duration: 0.15 } }}
            className="flex-1 flex justify-center items-center text-sm sm:text-base"
            onClick={() => setCommentsOpened(!commentsOpened)}
          >
            {commentsOpened ? (
              <AnnotationIconSolid className="h-5 sm:h-6" />
            ) : (
              <AnnotationIconOutline className="h-5 sm:h-6" />
            )}
            <div className="font-medium ml-2">{commentsCount}</div>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {commentsOpened && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="bg-gray-100 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col gap-2 sm:gap-6 px-4 py-5 sm:px-8 sm:py-8">
              <motion.form
                onSubmit={handleCommentSubmit}
                variants={item}
                className="flex w-full h-12 sm:h-14 pl-4 sm:pl-6 rounded-full bg-white mb-4"
              >
                <input
                  ref={commentInputRef}
                  type="text"
                  className="flex-1 bg-transparent placeholder:text-[#555555] focus:outline-0"
                  placeholder="Write a comment..."
                />
                <motion.button
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1, transition: { duration: 0.15 } }}
                  className="flex justify-center items-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary"
                >
                  {isSubmittingComment ? (
                    <PulseLoader color={"#fff"} size={6} />
                  ) : (
                    <PaperAirplaneIcon className="h-5 sm:h-6 text-white rotate-90" />
                  )}
                </motion.button>
              </motion.form>
              <div className="flex flex-col gap-5 sm:gap-6">
                {isCommentsLoading ? (
                  <div className="flex justify-center p-6">
                    <PulseLoader color={"#555"} />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex justify-center p-4 sm:p-6">
                    No comments
                  </div>
                ) : (
                  comments.map((comment, i) => (
                    <Comment
                      key={i}
                      variants={item}
                      posterId={userId}
                      {...comment}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
