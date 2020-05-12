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

    let PI = Math.PI;
    let ctx = canvas.getContext('2d');
    let cwidth = canvas.width;
    let cheight = canvas.height;

    //环形半径
    let r = cwidth / 2;
    let cr = r - (r / 4);
    let minHeight = 2;
    let meterWidth = 5;

    //设置方块的数量，考虑到闭环的关系
    let meterNum = this.props.r / 4;
    let gradient = ctx.createLinearGradient(0, -cr, 0, -cwidth / 2);
    gradient.addColorStop(0, 'rgba(127,127,127,0.75)');
    gradient.addColorStop(0.5, 'rgba(127,127,127,0.75)');
    gradient.addColorStop(1, 'rgba(127,127,127,0.75)');
    ctx.fillStyle = gradient;

    let x = 180;
    function render() {
      let array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let step = Math.round(array.length / x);
      ctx.clearRect(0, 0, cwidth, cheight);
      ctx.save();
      ctx.translate(cwidth / 2, cheight / 2);
      for (let i = 0; i < meterNum; i++) {
        let value = array[i * step];

        // 动态高度
        let meterHeight = value * (cheight / 2 - cr) / 256 || minHeight;
        ctx.rotate(2 * PI / meterNum);
        ctx.fillRect(-meterWidth / 2, -cr - meterHeight, meterWidth, meterHeight);
      }
      ctx.restore();
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
