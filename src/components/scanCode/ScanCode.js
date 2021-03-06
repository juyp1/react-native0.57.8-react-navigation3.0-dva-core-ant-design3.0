import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Easing,
    StatusBar,
    Image,
    Text
} from 'react-native';
import {
    Icon,
} from '@ant-design/react-native';
import { RNCamera } from 'react-native-camera';
import {
    screenH,
    screenW,
    APP_Bar_Height
} from './ScreenUtils';
const cameraHeight = 270;
const cameraWidth = 270;
const maskHeight = parseInt((screenH - APP_Bar_Height - cameraHeight) / 2);
const maskWidth = parseInt((screenW - cameraWidth) / 2);
const viewFinderSource = require('../../assets/images/viewfinder.png');
export default class ScanScreen extends Component {

    static navigationOptions = {
        title: '扫一扫'
    }

    constructor() {
        super();
        this.state = {
            animatedValue: new Animated.Value(-cameraHeight)
        };
        this.isOnBarcodeRead = false;
    }

    componentDidMount(){
        this.scannerLineMove();
    };

    scannerLineMove = () => {
        this.state.animatedValue.setValue(-cameraHeight);  //重置动画值为0
        Animated.timing(this.state.animatedValue, {
            toValue: cameraHeight,
            duration: 2500,
            easing: Easing.linear
        }).start(() => this.scannerLineMove());
    };

    enableBarcodeRead = () => {
        this.isOnBarcodeRead = false;
    }
    disableBarcodeRead = () => {
        this.isOnBarcodeRead = true;
    }

    onSuccess = (qrInfo) => {
       alert(qrInfo)
    }

    onError = (data) => {
        setTimeout(()=> this.enableBarcodeRead(), 1000);
    }

    render() {
        return (
            <View
                style={{
                    flex:1,
                    flexDirection: 'column',
                }}
            >
                <View style={styles.header}>
                    <View style={styles.headLeft}>
                        <Icon style={{color:'rgba(0,0,0,0.6)',paddingLeft:10}} name={'arrow-left'}
                              onPress={()=>{
                                  this.props.navigation.goBack();
                              }}
                        />
                    </View>
                    <View style={styles.flex1}>
                        <Text>扫一扫</Text>
                    </View>
                    <View style={styles.flex1}>

                    </View>
                </View>
                <View style={styles.container}>
                    <StatusBar barStyle='dark-content' />
                    <RNCamera
                        ref="camera"
                        type={RNCamera.Constants.Type.back}
                        style = {styles.cameraView}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        onBarCodeRead={this._onBarCodeRead}
                    >
                        <View style={styles.maskOuter}>
                            <View style={[{height: maskHeight}, styles.maskItem]} />
                            <View style={styles.maskCenter}>
                                <View style={[{width: maskWidth}, styles.maskItem]} />
                                <View style={styles.maskInner}>
                                    <Animated.View
                                        style={{
                                            transform: [{
                                                translateY: this.state.animatedValue,
                                            }]
                                        }}
                                    >
                                        <Image
                                            source={viewFinderSource}
                                            resizeMode="stretch"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    </Animated.View>
                                </View>
                                <View style={[{width: maskWidth}, styles.maskItem]} />
                            </View>
                            <View style={[{height: maskHeight}, styles.maskItem]} />
                        </View>
                    </RNCamera>
                </View>
            </View>
        );
    }

    _onBarCodeRead = ({result}) => {
        if(this.isOnBarcodeRead) return false;
        this.disableBarcodeRead();
        setTimeout(() => {
            this.onSuccess(result);
        }, 600);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraView: {
        flex: 1
    },
    maskOuter: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
    },
    maskItem: {
        backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskCenter: {
        flexDirection: 'row',
    },
    maskInner: {
        width: cameraWidth,
        height: cameraHeight,
        overflow: 'hidden',
        borderColor: '#fff',
        borderWidth: 1
    },
    header: {
        height: 60,
        flexDirection: 'row',
        backgroundColor:'#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    headLeft:{
        flex: 1,
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    title: {
        fontSize: 20,
        color:'rgba(0,0,0,0.6)'
    },
    add: {
        fontSize: 18,
        color: '#fff',
    }
});