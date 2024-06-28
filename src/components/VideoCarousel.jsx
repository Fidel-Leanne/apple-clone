import { useRef, useState, useEffect } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  // Refs to store references to video elements, span elements, and div elements
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // State to manage video status
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isPlaying: false,
    isLastVideo: false,
  });

  // State to track loaded metadata of videos
  const [loadedData, setLoadedData] = useState([]);

  // Destructure state for easier access
  const { isPlaying, isLastVideo, startPlay, isEnd, videoId } = video;

  // Effect to set up GSAP animation for ScrollTrigger
  useGSAP(() => {
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          startPlay: true,
          isPlaying: true,
        }));
      }
    });
  }, []);

  // Effect to handle video play/pause based on the state
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // Effect to handle GSAP animation for the video progress span
  useEffect(() => {
    let span = videoSpanRef.current;

    if (span[videoId]) {
      gsap.to(span[videoId], {
        onUpdate: () => {
          // Logic to update progress can be added here
        },
        onComplete: () => {
          // Logic for completion can be added here
        },
      });
    }
  }, [videoId, startPlay]);

  // Handler for loaded metadata event
  const handleLoadedMetaData = (index, event) => {
    setLoadedData((prevData) => [...prevData, event]);
  };

  // Handler to manage video controls and state updates
  const handleProcess = (type, index) => {
    switch (type) {
      case 'video-end':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: index + 1,
        }));
        break;

      case 'video-last':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }));
        break;

      case 'video-reset':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: false,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case 'play':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;

      case 'pause':
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: false,
        }));
        break;

      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} className="pr-10 sm:pr-20" id="slider">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  muted
                  playsInline
                  preload="auto"
                  ref={(el) => (videoRef.current[index] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(event) => handleLoadedMetaData(index, event)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="text-white md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='relative flex-center mt-10 '>
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full '>
          {videoRef.current.map((_, index) => (
            <span key={index}
              className={`mx-2 w-3 h-3 rounded-full bg-gray-200 relative cursor-pointer`}
              ref={(el) => (videoDivRef.current[index] = el)}>
              <span className='absolute h-full w-full rounded-full'
                ref={(el) => (videoSpanRef.current[index] = el)} />
            </span>
          ))}
        </div>

        <button className='control-btn'>
          <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={isLastVideo ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
