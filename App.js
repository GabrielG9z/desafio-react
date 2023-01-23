import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function ImagePickerExample() {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [foto, setFoto] = useState();
  const [titulo, onChangeText] = useState();

  const obterTitulo = useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }
    verificaPermissoes();
  }, []);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(imagem);
    setFoto(imagem.assets[0].uri);
  };

  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = Location.requestForegroundPermissionsAsync();

      let localizacaoAtual = await Location.getCurrentPositionAsync({});

      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);
  console.log(minhaLocalizacao);
  const regiaoInicial = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const [localizacao, setLocalizacao] = useState();

  const marcarLocal = (event) => {
    setLocalizacao({
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
    });
    console.log(localizacao);
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={estilos.titulo}>
          <TextInput
            style={estilos.input}
            onChangeText={onChangeText}
            value={titulo}
            placeholder="Digite um título"
            textAlign="center"
          />
        </View>
        {foto && (
          <Image source={{ uri: foto }} style={{ width: 300, height: 200 }} />
        )}
        <View style={estilos.botao}>
          <Button title="Take a Photo" onPress={acessarCamera} color="black" />
        </View>

        <MapView
          onPress={marcarLocal}
          style={estilos.mapa}
          region={localizacao ?? regiaoInicial}
          liteMode={false}
          mapType="hybrid"
        >
          {localizacao && (
            <Marker
              coordinate={localizacao}
              title="Aqui !"
              onPress={(e) => console.log(e.nativeEvent)}
            />
          )}
        </MapView>
        <View style={estilos.botao}>
          <Button
            title="Find my Location"
            onPress={marcarLocal}
            color="black"
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const estilos = StyleSheet.create({
  botao: {
    margin: 8,
    borderWidth: "2px",
    borderRadius: "3px",
    backgroundColor: "#63F893",
  },
  mapa: {
    width: 300,
    height: 250,
  },
  container: {
    flex: 1,
  },

  titulo: {
    margin: 5,
    borderWidth: "2px",
    borderRadius: "4px",
    width: 300,
    borderColor: "#63BAF8",
  },
  input: {
    fontSize: 22,
  },
});
