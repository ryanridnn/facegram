import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

//component
import { Swiper, SwiperSlide as Slide } from "swiper/react";
import PulseLoader from "react-spinners/PulseLoader";
import Modal from "../Modal";
import SwiperNavButtons from "../SwiperNavButtons/";

import { uploadPost } from "../../services/store/actions/postsActions";

//icons
import { CameraIcon, XIcon } from "@heroicons/react/outline";

const PostFormModal = ({ modalOpened, setModalOpened }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [media, setMedia] = useState([]);
  const [dataURLs, setDataURLs] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const descRef = useRef("");

  const fileInputRef = useRef();

  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setDataURLs([]);
    media.forEach((m) => {
      const temp = [
        ...dataURLs,
        { id: m.id, content: URL.createObjectURL(m.file) },
      ];
      const filtered = [];

      media.forEach((me) => {
        const selected = temp.filter((t) => t.id === me.id)[0];

        if (!selected) return;
        filtered.push(selected);
      });

      setDataURLs(filtered);
    });
  }, [media]);

  const handlePost = async (e) => {
    if (isPosting) return;
    else if (!descRef.current) {
      return;
    }

    const obj = {
      desc: descRef.current,
    };

    setIsPosting(true);

    await uploadPost(
      media.map((m) => m.file),
      obj,
      dispatch
    );

    setIsPosting(false);

    setMedia([]);
    setDataURLs([]);
    setModalOpened(false);
  };

  return (
    <Modal
      title="Create Post"
      modalOpened={modalOpened}
      setModalOpened={setModalOpened}
    >
      <div className="max-h-full flex flex-col">
        <div className="p-6 bg-gray-100 overflow-y-auto">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src={currentUser.photoURL}
                  alt="profile pic"
                  className="w-full"
                  k
                />
              </div>
              <div className="font-medium text-lg">{currentUser.name}</div>
            </div>
            <motion.label
              htmlFor="file-input"
              whileHover={{
                scale: 1.15,
                transition: { duration: 0.15 },
              }}
              className="flex justify-center items-center w-11 h-11 rounded-full bg-primary"
            >
              <CameraIcon className="h-5 text-white"></CameraIcon>
            </motion.label>
            <input
              id="file-input"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files.length === 0) return;
                setMedia([...media, { id: v4(), file: e.target.files[0] }]);
                e.target.value = null;
              }}
            />
          </div>
          <textarea
            className="mt-5 text-lg w-full h-32 sm:h-24 resize-none bg-transparent focus:outline-none placeholder:text-[#555555]"
            placeholder="Tell what you think..."
            autoFocus
            onChange={(e) => {
              descRef.current = e.target.value;
            }}
          ></textarea>
          <Swiper
            onProgress={(swiper, progress) => setProgress(progress)}
            className="relative"
          >
            <SwiperNav total={media.length} progress={progress} />
            {dataURLs.map((d, i) => (
              <Slide
                key={i}
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <div className="mb-4 relative group">
                  <img src={d.content} alt="media" className="w-full" />
                  <button
                    onClick={() => {
                      setMedia(media.filter((_, j) => i !== j));
                    }}
                    className="flex justify-center items-center absolute top-2 right-2 h-10 w-10 rounded-full bg-red-100 shadow-lg opacity-100 lg:opacity-0 linear duration-150 group-hover:opacity-100"
                  >
                    <XIcon className="h-6 w-6 text-red-400" />
                  </button>
                  {dataURLs.length !== 1 && (
                    <SwiperNavButtons hover={hover} progress={progress} />
                  )}
                </div>
              </Slide>
            ))}
          </Swiper>

          {/*<div className="flex gap-4">
          <div className="flex gap-3 p-3 bg-white rounded-full">
            <motion.button
              whileHover={{
                scale: 1.15,
                transition: { duration: 0.15 },
              }}
              className="bg-gray-700 rounded-full h-6 w-6 flex justify-center items-center"
            >
              <BanIcon className="h-6 text-white"></BanIcon>
            </motion.button>
            {bgColors.map((color, i) => (
              <motion.button
                key={i}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.15 },
                }}
                className="rounded-full h-6 w-6"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>*/}
        </div>
        <div className="px-6 py-5 flex-1">
          <motion.button
            onClick={handlePost}
            whileHover={{
              scale: 0.98,
              transition: { duration: 0.15 },
            }}
            className="w-full bg-primary p-4 text-md text-white font-semibold rounded-lg"
          >
            {isPosting ? <PulseLoader size={10} color={"#fff"} /> : "Post"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

const SwiperNav = ({ total, progress }) => {
  const getNavMatch = (i) => {
    const currentSlide = Math.ceil(total * progress);
    if (currentSlide === 0) return 1 === i + 1;
    else return currentSlide === i + 1;
  };

  return (
    total !== 1 && (
      <div className="absolute bottom-2 w-full h-14 flex justify-center items-center gap-2.5 z-40">
        {Array.from({ length: total }).map((n, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full bg-white drop-shadow-2xl ${
              getNavMatch(i) ? "opacity-100" : "opacity-60"
            }`}
          ></div>
        ))}
      </div>
    )
  );
};

export default PostFormModal;
