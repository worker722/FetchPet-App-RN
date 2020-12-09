import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

const styles = StyleSheet.create({

    textinput: {
        borderWidth: 1,
        borderColor: BaseColor.dddColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        justifyContent: 'center'
    },
});

export default styles;