import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackPramList } from '../../routes/app.routes'
import { api } from '../../services/api'


export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackPramList>>()
    const [number, setNumber] = useState('')


    async function openOrder() {

        if (number === '') {
            return
        }

        const response = await api.post('/order', {
            table: Number(number)
        })
        console.log(response.data)

        //Precisa fazer a requisição e abrir a mesa e navegar pra próxima tela
        navigation.navigate('Order', {
            number: number,
            order_id: response.data.id// Pegar o Id de um Produto

        })
        setNumber("")

    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>
            <TextInput
                placeholder="Número da mesa"
                placeholderTextColor={'#FFF'}
                style={styles.input}
                keyboardType='numeric'
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText} >Abrir mesa</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#1d1d2e'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#FFF",
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        marginTop: 20,
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    }
})