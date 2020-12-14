import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

const styles = StyleSheet.create({

    textinput: {
        borderWidth: 1,
        borderColor: BaseColor.dddColor,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BaseColor.modalBackDropColor,
    },
    modalContentContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        justifyContent: 'center'
    },
});

export default styles;