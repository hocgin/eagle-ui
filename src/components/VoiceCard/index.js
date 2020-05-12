import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';

class Index extends React.PureComponent {
  canvasRef = React.createRef();
  componentRef = React.createRef();
  audioRef = React.createRef();

  componentDidMount() {
    this.initAudio();
  }

  render() {
    let { r, src } = this.props;
    return (<canvas ref={this.canvasRef}
                    width={r}
                    height={r}
                    className={styles.component}>
      <audio ref={this.audioRef} className={styles.audio} src={src}
             crossOrigin="anonymous" controls autoPlay loop/>
    </canvas>);
  }

  initAudio() {
    let audio = this.audioRef.current;
    let canvas = this.canvasRef.current;

    let audioCtx = new AudioContext();
    let analyser = audioCtx.createAnalyser();
    let audioSrc = audioCtx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;

    let ctx = canvas.getContext('2d');
    let cwidth = canvas.width;
    let cheight = canvas.height - 2;

    //方块的宽度
    let meterWidth = 7;
    //方块的间距
    let gap = 3;
    let capHeight = 2;
    let meterNum = cwidth / (meterWidth + gap);

    let gradient = ctx.createLinearGradient(0, 0, 0, cheight);
    gradient.addColorStop(1, '#00ff00');
    gradient.addColorStop(0.8, '#ffff00');
    gradient.addColorStop(0, '#ff0000');
    ctx.fillStyle = gradient;

    function render() {
      let array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let step = Math.round(array.length / meterNum);
      ctx.clearRect(0, 0, cwidth, cheight);
      for (let i = 0; i < meterNum; i++) {
        let value = array[i * step];
        ctx.fillRect(i * (meterWidth + gap), cheight - value + capHeight, meterWidth, cheight || capHeight);
      }
      requestAnimationFrame(render);
    }

    render();
  }

  static propTypes = {
    children: PropTypes.node,
    r: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: <></>,
    r: 400,
    src: 'https://web.codelabo.cn/demo/22716475.mp3',
  };
}

export default Index;
