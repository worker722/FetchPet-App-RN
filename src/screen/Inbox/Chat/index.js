import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    AppState,
    Platform,
    KeyboardAvoidingView,
    BackHandler,
    Modal,
    Alert
} from 'react-native';
import { ChatMessage, Loader } from '@components';
import { BaseColor } from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Styles from './style';

import Menu, { MenuItem } from 'react-native-material-menu';

import messaging from '@react-native-firebase/messaging';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "@store";
import * as Api from '@api';
import * as global from "@api/global";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: [],
            ad_images: [],
            room: null,
            ads: null,
            other_user: null,

            message: '',
            attach_file: null,

            showLoader: false,
            showRefresh: false,
            visiblePickerModal: false,
            is_sending: false,
        }

        this.menuRef = null;

        props.navigation.addListener("willFocus", (event) => {
            this.props.setStore(global.IS_IN_CHAT_PAGE, true);
        });
    }

    createNotificationListeners = async () => {
        try {
            this.notificationListener = messaging().onMessage((notification) => {
                this._onMessageReceived(notification);
            });
        } catch (error) {
        }
    }

    _onMessageReceived = (notification) => {
        try {
            const { data } = notification;
            const notificationData = JSON.parse(data.data);
            if (notificationData.notification_type == global.CHAT_MESSAGE_NOTIFICATION) {
                const user_id = store.getState().auth.login.user.id;
                const { room } = this.state;
                if (notificationData.id_room == room.id && notificationData.id_user_snd != user_id && this.props.IS_IN_CHAT) {
                    let { chat } = this.state;
                    chat.push(notificationData);
                    this.setState({ chat });
                    this.props.api.post("chat/read", { id: room.id });
                }
            }
        } catch (error) {
            console.log('chat notification received error', error);
        }
    }

    handleAppStateChange = (nextAppState) => { }

    componentDidMount = async () => {
        await this.createNotificationListeners();
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    backAction = () => {
        this.props.setStore(global.IS_IN_CHAT_PAGE, false);
        return false;
    }

    componentWillUnmount = () => {
        this.notificationListener && this.notificationListener();

        AppState.removeEventListener('change', this.handleAppStateChange);
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }

    UNSAFE_componentWillMount = async () => {
        this.setState({ showLoader: true });
        await this.start();
    }

    start = async () => {
        const { ad_id, room_id } = this.props.navigation.state.params;
        const param = { ad_id, room_id };
        const response = await this.props.api.post("chat", param);
        if (response?.success) {
            const { ads, room } = response.data;
            const user_id = store.getState().auth.login.user.id;
            const other_user = user_id == room.seller.id ? room.buyer : room.seller;

            const ad_images = [];
            ads.meta.forEach((item, key) => {
                if (item.meta_key == '_ad_image')
                    ad_images.push(item.meta_value);
            });

            this.setState({
                room,
                ads,
                other_user,
                ad_images,
                chat: room.message,
            })
        }
        else {
            this.props.navigation.goBack(null);
        }
        this.setState({ showLoader: false, showRefresh: false });
        this.scrollView?.scrollToEnd({ animated: true });
    }

    _onRefresh = async () => {
        this.setState({ showRefresh: true });
        await this.start();
    }

    openPhotoPicker = (index) => {
        if (index == 0) {
            ImagePicker.openCamera({
                multiple: false,
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true,
                cropping: true
            }).then(images => {
                this.setState({ visiblePickerModal: false, attach_file: images });
            });
        }
        else if (index == 1) {
            ImagePicker.openPicker({
                multiple: false,
                mediaType: 'photo',
                width: 500,
                height: 500,
                includeExif: true,
                cropping: true
            }).then(images => {
                this.setState({ visiblePickerModal: false, attach_file: images });
            });
        }
    }

    showPickerModal = () => {
        this.setState({ visiblePickerModal: true })
    }

    sendMessage = async () => {
        const { message, room, attach_file } = this.state;
        const user_id = store.getState().auth.login.user.id;
        if (message == '' && !attach_file)
            return;

        const param = {
            id_room: room.id,
            id_user_snd: user_id,
            message: message,
            read_status: 0
        }
        this.setState({ is_sending: true });
        let response = null;
        if (attach_file)
            response = await this.props.api.postMessage('chat/post', attach_file, param);
        else
            response = await this.props.api.post('chat/post', param);

        this.setState({ is_sending: false });
        if (response?.success) {
            let chat = this.state.chat;
            chat.push(response.data.newMessage);
            this.setState({ chat: chat });
        }
        this.setState({ message: '', attach_file: null });
    }

    setMenuRef = ref => {
        this.menuRef = ref;
    };

    block = () => {
        Alert.alert(
            'Block this User?',
            "If you block this user, all contact will be blocked with this user." + "\n" + "Are you sure you want to block this user?",
            [
                {
                    text: 'Block',
                    onPress: async () => {
                        this.menuRef.hide();
                        await this.props.api.post("inbox/block", { room_id: this.state.room.id });
                        this.props.navigation.goBack(null);
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => this.menuRef.hide(),
                    style: 'cancel'
                },
            ],
            { cancelable: false }
        );
    };

    showMenu = () => {
        this.menuRef.show();
    };

    render = () => {
        const { chat, ads, showLoader, showRefresh, other_user, is_sending, ad_images, visiblePickerModal, attach_file, room } = this.state;
        const navigation = this.props.navigation;

        let image_name = '';
        if (attach_file) {
            const splite = attach_file.path.split("/");
            image_name = splite[splite.length - 1];
        }

        let is_blocked = false;
        if (room) {
            const { seller, buyer, s_block_b, b_block_s } = room;
            if (other_user == buyer && b_block_s > 0) {
                is_blocked = true;
            }
            else if (other_user == seller && s_block_b > 0) {
                is_blocked = true;
            }
        }

        if (showLoader)
            return (<Loader />);

        return (
            <KeyboardAvoidingView behavior={Platform.OS == "android" ? "" : "padding"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={40}>
                <View style={{ flex: 1, marginBottom: 10, backgroundColor: BaseColor.whiteColor }}>
                    <View style={{ width: "100%", height: 80, backgroundColor: BaseColor.primaryColor, flexDirection: "row", padding: 10 }}>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", padding: 10 }}
                            onPress={() => {
                                navigation.navigate("Inbox");
                                this.props.setStore(global.IS_IN_CHAT_PAGE, false);
                            }} >
                            <Icon name={"arrow-left"} size={20} color={BaseColor.whiteColor}></Icon>
                        </TouchableOpacity>
                        <View style={{ justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ShowProfile", { user_id: other_user.id });
                                    this.props.setStore(global.IS_IN_CHAT_PAGE, false);
                                }} >
                                {other_user?.avatar ?
                                    <Image
                                        source={{ uri: Api.SERVER_HOST + other_user?.avatar }}
                                        activeOpacity={0.7}
                                        placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                        PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                        style={{ alignSelf: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: BaseColor.dddColor, width: 60, height: 60, borderRadius: 100 }}>
                                    </Image>
                                    :
                                    <View style={{ width: 60, height: 60, borderRadius: 100, marginHorizontal: 10, borderWidth: 2, borderColor: BaseColor.whiteColor, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: BaseColor.whiteColor, fontSize: 25 }}>{other_user?.name.charAt(0).toUpperCase()}</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("AdDetail", { ad_id: ads.id });
                                    this.props.setStore(global.IS_IN_CHAT_PAGE, false);
                                }}
                                style={{ position: "absolute", bottom: 0, right: 3, width: 25, height: 25, borderRadius: 100 }}>
                                <Image
                                    source={{ uri: Api.SERVER_HOST + ad_images[0] }}
                                    activeOpacity={0.7}
                                    placeholderStyle={{ backgroundColor: BaseColor.whiteColor }}
                                    PlaceholderContent={<ActivityIndicator color={BaseColor.primaryColor} />}
                                    style={{ borderWidth: 1, borderColor: BaseColor.dddColor, width: 25, height: 25, borderRadius: 100 }}>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "center", paddingLeft: 10, flex: 1 }}>
                            <Text style={{ color: BaseColor.whiteColor }}>{other_user?.name}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={this.showMenu}
                            style={{ justifyContent: "center", alignItems: "center", paddingLeft: 30 }}>
                            <Icon name={"ellipsis-v"} size={18} color={"white"}></Icon>
                        </TouchableOpacity>
                        <Menu
                            ref={this.setMenuRef}>
                            <MenuItem onPress={this.block}>Block</MenuItem>
                        </Menu>
                    </View>
                    <ScrollView
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.scrollView.scrollToEnd({ animated: true });
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={showRefresh}
                                onRefresh={this._onRefresh}
                            />
                        }>
                        <View style={{ flex: 1, padding: 10 }}>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                data={chat}
                                renderItem={(item, index) => (
                                    <ChatMessage data={item} />
                                )}
                            />
                        </View>
                    </ScrollView>
                    {attach_file &&
                        <View style={{ height: 80, marginBottom: 1, backgroundColor: BaseColor.dddColor, paddingHorizontal: 15, borderRadius: 15, marginHorizontal: 10, padding: 3, borderWidth: 1, borderColor: BaseColor.dddColor, flexDirection: "row" }}>
                            <TouchableOpacity style={{ position: "absolute", top: 0, right: 3, padding: 6 }} onPress={() => this.setState({ attach_file: null })}>
                                <Icon name={"times"} size={22} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                            <Image source={{ uri: attach_file.path }} style={{ width: 75, height: 75, borderRadius: 5 }}></Image>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
                                <Text style={{ paddingHorizontal: 10, width: 200 }} numberOfLines={1}>{image_name}</Text>
                            </View>
                        </View>
                    }
                    <View style={{ height: 45, paddingHorizontal: 5, width: "100%", justifyContent: "center", alignItems: "center" }}>
                        {!is_blocked ?
                            <>
                                <TextInput
                                    style={{ flex: 1, textAlignVertical: "center", backgroundColor: BaseColor.dddColor, width: "100%", borderRadius: 30, paddingLeft: 20, paddingRight: 90 }}
                                    value={this.state.message}
                                    multiline={true}
                                    placeholder="Type Message..."
                                    onChangeText={(text) => this.setState({ message: text })}
                                >
                                </TextInput>
                                <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={this.showPickerModal}>
                                        <Icon name={"paperclip"} size={20} color={BaseColor.greyColor}></Icon>
                                    </TouchableOpacity>
                                    {is_sending ?
                                        <View style={{ padding: 8, marginRight: 15, borderRadius: 100, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                                            <ActivityIndicator color={BaseColor.primaryColor} />
                                        </View>
                                        :
                                        <TouchableOpacity onPress={() => this.sendMessage()} style={{ padding: 8, marginRight: 15, borderRadius: 100, backgroundColor: BaseColor.whiteColor, justifyContent: "center", alignItems: "center" }}>
                                            <Icon name={"location-arrow"} size={15} color={BaseColor.greyColor}></Icon>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </>
                            :
                            <TextInput
                                style={{ flex: 1, textAlign: "center", backgroundColor: BaseColor.dddColor, color: "red", width: "100%", borderRadius: 30 }}
                                editable={false}
                                value={"You can't chat with this user anymore."} />
                        }
                    </View>
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visiblePickerModal}>
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modalContentContainer}>
                            <Text style={{ fontSize: 20, }}>Select attach image</Text>
                            <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 10 }} onPress={() => this.setState({ visiblePickerModal: false })}>
                                <Icon name={"times"} size={22} color={BaseColor.primaryColor}></Icon>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.openPhotoPicker(0)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"camera"} size={20} color={BaseColor.whiteColor}></Icon>
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, marginLeft: 20 }}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.openPhotoPicker(1)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: BaseColor.primaryColor, justifyContent: "center", alignItems: "center" }}>
                                    <Icon name={"image"} size={20} color={BaseColor.whiteColor}></Icon>
                                </View>
                                <Text style={{ flex: 1, fontSize: 17, marginLeft: 20 }}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = ({ app: { IS_IN_CHAT } }) => {
    return { IS_IN_CHAT };
}

const mapDispatchToProps = dispatch => {
    return {
        api: bindActionCreators(Api, dispatch),
        setStore: (type, data) => dispatch({ type, data })
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);