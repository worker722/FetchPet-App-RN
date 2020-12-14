import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

const styles = StyleSheet.create({

    textinput: {
        borderWidth: 1,
        borderColor: BaseColor.dddColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BaseColor.modalBackDropColor,
    },
    modalContentContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        paddingTop: 30,
        justifyContent: 'center'
    },
});

export default styles;