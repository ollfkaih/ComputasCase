import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';

export enum Trash {
    Matavfall = 'Matavfall',
    Restavfall = 'Restavfall',
    Papir = 'Papir',
    Plast = 'Plast',
    Pant = 'Pant',
}

export const TrashColors = {
    [Trash.Matavfall]: '#479E55',
    [Trash.Restavfall]: '#000',
    [Trash.Papir]: '#3880B9',
    [Trash.Plast]: '#8A297E',
    [Trash.Pant]: '#151410',
}

export const TrashImages = {
    [Trash.Matavfall]: require('../assets/icons/Matavfall.png'),
    [Trash.Restavfall]: require('../assets/icons/Restavfall.png'),
    [Trash.Papir]: require('../assets/icons/Papp.png'),
    [Trash.Plast]: require('../assets/icons/Plast.png'),
    [Trash.Pant]: require('../assets/icons/Pant.png'),
}

interface ResultBoxProps {
    trashType: Trash;
}

const ResultBox: React.FC<ResultBoxProps> = ({ trashType }) => {
    return (
        <View style={[styles.container, { backgroundColor: TrashColors[trashType] }]}>
            <Image style={styles.icon} source={TrashImages[trashType]} />
            <Text style={styles.text}>{trashType}</Text>
            <Image style={styles.image} source={require("../assets/cookie.png")} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5', // Light gray (for better visibility)
        borderRadius: 8,
        margin: 5,
        justifyContent: 'space-between'
    },
    icon: {
        width: 75,
        height: 75,
        flex: 1,
        alignSelf: 'center',
    },
    text: {
        flex: 3, // Gives the text more space, adjust as needed
        textAlign: 'left',
        color: '#fff',
        fontSize: 38,
        fontWeight: 'bold',
        paddingLeft: 20,
    },
    image: {
        width: 75,
        height: 75,
        flex: 1,
        alignSelf: 'flex-end',
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 8,
    }
});


export default ResultBox;