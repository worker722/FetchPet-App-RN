
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

const styles = StyleSheet.create({

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
        padding: 25,
        justifyContent: 'center'
    },
});

export default styles;