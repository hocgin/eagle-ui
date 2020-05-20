import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import PlayCircleFilled from '@ant-design/icons/lib/icons/PlayCircleFilled';
import PauseCircleFilled from '@ant-design/icons/lib/icons/PauseCircleFilled';


function getGb(str) {
  let g = 0;
  let b = 0;
  for (let i = 0; i < str.length / 2; i++) {
    let code = str.charCodeAt(i);
    g = g + code;
    code = str.charCodeAt(i * 2);
    b = b + code;
  }
  return {
    g: g % 256,
    b: b % 256,
  };
}

function getFileName(src) {
  let path = `${src}`;
  let lastIndexOf = path.lastIndexOf('/');
  return decodeURI(path.substr(lastIndexOf === -1 ? 0 : (lastIndexOf + 1)));
}

class Index extends React.PureComponent {
  canvasRef = React.createRef();
  audioRef = React.createRef();
  state = {
    isPause: true,
    voiceName: 'Unknown',
  };

  componentDidMount() {
    this.initAudio();
    let audio = this.audioRef.current;
    audio.addEventListener('playing', () => {
      this.setState({
        isPause: false,
      });
    });
    audio.addEventListener('pause', () => {
      this.setState({
        isPause: true,
      });
    });

    this.setState({
      voiceName: getFileName(audio.src),
    });
  }

  componentWillUnmount() {
    let audio = this.audioRef.current;
    audio.removeEventListener('playing');
    audio.removeEventListener('pause');
  }

  render() {
    let { height, width, src } = this.props;
    let { isPause, voiceName } = this.state;
    return (<div className={styles.component}>
      <div className={styles.top}>
        <div className={styles.title}>{voiceName}</div>
        <button className={styles.btn} onClick={this.onClickToggle}>
          {isPause ? <PlayCircleFilled/> : <PauseCircleFilled/>}
        </button>
      </div>
      <div className={styles.canvasWrapper}>
        <canvas ref={this.canvasRef}
                width={width}
                height={height}
                className={styles.canvas}/>
      </div>
      <audio ref={this.audioRef} className={styles.audio} src={src}
             crossOrigin="anonymous" controls autoPlay loop/>
    </div>);
  }

  onClickToggle = () => {
    let audio = this.audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  initAudio() {
    let audio = this.audioRef.current;
    let canvas = this.canvasRef.current;
    let audioUrl = this.audioRef.current.src;

    let audioCtx = new AudioContext();
    let analyser = audioCtx.createAnalyser();
    let audioSrc = audioCtx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;
    let bufferLength = analyser.frequencyBinCount;
    let array = new Float32Array(bufferLength);

    let ctx = canvas.getContext('2d');

    let { g, b } = getGb(`${audioUrl}`);

    //方块的间距
    let gap = 3;
    let MIN = 7;

    function render() {
      let WIDTH = canvas.width;
      let HEIGHT = canvas.height;

      // 方块的宽度
      const barWidth = (WIDTH / bufferLength) * 4;
      analyser.getFloatFrequencyData(array);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      let barHeight = 0;
      let point = 0;

      for (let i = 0; i < bufferLength; i++) {
        point = array[i];
        barHeight = (point + 140) * 2;

        const r = Math.floor(barHeight + 64);
        if (g % 3 === 0) {
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else if (g % 3 === 1) {
          ctx.fillStyle = `rgb(${g},${r},${b})`;
        } else {
          ctx.fillStyle = `rgb(${g},${b},${r})`;
        }

        barHeight = HEIGHT / MIN + barHeight / 256 * HEIGHT * (MIN - 1) / MIN;
        if (barHeight < HEIGHT / MIN) {
          barHeight = HEIGHT / MIN;
        }

        ctx.fillRect(i * (barWidth + gap), HEIGHT - barHeight, barWidth, barHeight);
      }

      setTimeout(function() {
        requestAnimationFrame(render);
      }, 50);
    }

    render();
  }

  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: <></>,
    width: 400,
    height: 400,
    src: 'https://web.codelabo.cn/demo/22716475.mp3',
  };
}

export default Index;
