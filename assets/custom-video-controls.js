(function() {
  'use strict';

  function initCustomVideoControls(videoElement, container) {
    if (!videoElement || !container) return;

    // Create custom controls HTML
    const controlsHtml = `
      <div class="custom-video-controls">
        <div class="progress-container">
          <div class="progress-bar"></div>
        </div>
        <div class="controls-main">
          <div class="controls-left">
            <button class="control-btn play-pause-btn-custom" aria-label="Play/Pause">
              <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <svg class="pause-icon" viewBox="0 0 24 24" style="display:none;"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            </button>
            <span class="time-display">0:00 / 0:00</span>
          </div>
          <div class="controls-right">
            <div class="volume-container">
              <button class="control-btn mute-btn-custom" aria-label="Mute/Unmute">
                <svg class="volume-up-icon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                <svg class="volume-off-icon" viewBox="0 0 24 24" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              </button>
              <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">
            </div>
            <button class="control-btn options-btn-custom" aria-label="Settings">
              <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            </button>
            <button class="control-btn fullscreen-btn-custom" aria-label="Fullscreen">
              <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </button>
          </div>
        </div>
        <div class="options-menu">
           <div class="option-item playback-speed" data-speed="0.5">0.5x</div>
           <div class="option-item playback-speed" data-speed="1" class="active">Normal</div>
           <div class="option-item playback-speed" data-speed="1.25">1.25x</div>
           <div class="option-item playback-speed" data-speed="1.5">1.5x</div>
           <div class="option-item playback-speed" data-speed="2">2x</div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', controlsHtml);

    const controls = container.querySelector('.custom-video-controls');
    const playPauseBtnBottom = controls.querySelector('.play-pause-btn-custom');
    const playIconBottom = playPauseBtnBottom.querySelector('.play-icon');
    const pauseIconBottom = playPauseBtnBottom.querySelector('.pause-icon');
    
    // Find existing center play button if present
    const playPauseBtnCenter = container.querySelector('#playPauseBtn');
    const playIconCenter = playPauseBtnCenter ? playPauseBtnCenter.querySelector('#playIcon') : null;
    const pauseIconCenter = playPauseBtnCenter ? playPauseBtnCenter.querySelector('#pauseIcon') : null;
    const posterImg = container.querySelector('#videoPoster');

    const timeDisplay = controls.querySelector('.time-display');
    const progressContainer = controls.querySelector('.progress-container');
    const progressBar = controls.querySelector('.progress-bar');
    const muteBtn = controls.querySelector('.mute-btn-custom');
    const volumeUpIcon = muteBtn.querySelector('.volume-up-icon');
    const volumeOffIcon = muteBtn.querySelector('.volume-off-icon');
    const volumeSlider = controls.querySelector('.volume-slider');
    const fullscreenBtn = controls.querySelector('.fullscreen-btn-custom');
    const optionsBtn = controls.querySelector('.options-btn-custom');
    const optionsMenu = controls.querySelector('.options-menu');

    // Toggle Play/Pause
    function togglePlay() {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }

    playPauseBtnBottom.addEventListener('click', togglePlay);
    if (playPauseBtnCenter) {
      playPauseBtnCenter.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }
    
    // Clicking the video should also toggle play, but only if not clicking controls
    videoElement.addEventListener('click', togglePlay);

    videoElement.addEventListener('play', () => {
      // Update bottom icon
      playIconBottom.style.display = 'none';
      pauseIconBottom.style.display = 'block';

      // Update center button
      if (playPauseBtnCenter) {
        playPauseBtnCenter.classList.add('hidden');
        if (playIconCenter) playIconCenter.style.display = 'none';
        if (pauseIconCenter) pauseIconCenter.style.display = 'block';
      }
      
      if (posterImg) posterImg.classList.add('hidden');
    });

    videoElement.addEventListener('pause', () => {
      // Update bottom icon
      playIconBottom.style.display = 'block';
      pauseIconBottom.style.display = 'none';

      // Update center button
      if (playPauseBtnCenter) {
        playPauseBtnCenter.classList.remove('hidden');
        if (playIconCenter) playIconCenter.style.display = 'block';
        if (pauseIconCenter) pauseIconCenter.style.display = 'none';
      }
    });

    // Show center button on hover even when playing
    container.addEventListener('mouseenter', () => {
      if (!videoElement.paused && playPauseBtnCenter) {
        playPauseBtnCenter.classList.remove('hidden');
      }
    });

    container.addEventListener('mouseleave', () => {
      if (!videoElement.paused && playPauseBtnCenter) {
        playPauseBtnCenter.classList.add('hidden');
      }
    });

    // Update Time & Progress
    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    videoElement.addEventListener('timeupdate', () => {
      const current = formatTime(videoElement.currentTime);
      const duration = formatTime(videoElement.duration || 0);
      timeDisplay.textContent = `${current} / ${duration}`;

      const percent = (videoElement.currentTime / videoElement.duration) * 100;
      progressBar.style.width = `${percent}%`;
    });

    // Scrubbing
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.pageX - rect.left) / rect.width;
      videoElement.currentTime = pos * videoElement.duration;
    });

    // Volume
    muteBtn.addEventListener('click', () => {
      videoElement.muted = !videoElement.muted;
      if (videoElement.muted) {
        volumeUpIcon.style.display = 'none';
        volumeOffIcon.style.display = 'block';
        volumeSlider.value = 0;
      } else {
        volumeUpIcon.style.display = 'block';
        volumeOffIcon.style.display = 'none';
        volumeSlider.value = videoElement.volume;
      }
    });

    volumeSlider.addEventListener('input', (e) => {
      videoElement.volume = e.target.value;
      videoElement.muted = e.target.value == 0;
      if (videoElement.muted) {
        volumeUpIcon.style.display = 'none';
        volumeOffIcon.style.display = 'block';
      } else {
        volumeUpIcon.style.display = 'block';
        volumeOffIcon.style.display = 'none';
      }
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // Enter fullscreen
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else if (videoElement.webkitEnterFullscreen) {
          // Fallback specifically for iOS (iPhone)
          videoElement.webkitEnterFullscreen();
        } else if (videoElement.enterFullscreen) {
          videoElement.enterFullscreen();
        }
      }
    });

    // Options Menu
    optionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      optionsMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      optionsMenu.classList.remove('active');
    });

    optionsMenu.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const speed = e.target.dataset.speed;
        videoElement.playbackRate = parseFloat(speed);
        optionsMenu.querySelectorAll('.option-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Touch support for mobile to show/hide controls
    container.addEventListener('touchstart', () => {
      container.classList.add('touch-active');
      clearTimeout(container.touchTimeout);
      container.touchTimeout = setTimeout(() => {
        container.classList.remove('touch-active');
      }, 3000);
    });
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.video-container');
    containers.forEach(container => {
      const video = container.querySelector('video');
      if (video) {
        initCustomVideoControls(video, container);
      }
    });
  });
})();
