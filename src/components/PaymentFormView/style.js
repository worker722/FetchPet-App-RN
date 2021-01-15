import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    buttonWrapper: {
        padding: 10,
        zIndex: 100,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 20,
    },
    alertTextWrapper: {
        flex: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertIconWrapper: {
        padding: 5,
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertText: {
        color: '#c22',
        fontSize: 16,
        fontWeight: '400'
    },
    alertWrapper: {
        backgroundColor: '#ecb7b7',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 5,
        paddingVertical: 5,
        marginTop: 10
    }
});
