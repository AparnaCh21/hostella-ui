/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './src/context/AuthContext';
import Login from './src/components/Login'
import Dashboard from './src/components/Dashboard'
import Spinner from './src/components/Spinner'
import SignUp from './src/components/SignUp';
import * as Keychain from 'react-native-keychain';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

const Stack = createNativeStackNavigator();

const App = () =>  {

  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');
  const loadJWT = useCallback(async ()=>{
    try{
      const value = await Keychain.getGenericPassword();
      console.log({value})
      const jwt = value ? JSON.parse(value.password) : {};
      console.log(jwt);
      authContext.setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null && jwt.accessToken !== undefined,
      });
      setStatus('success');
    }catch (error){
      setStatus('error');
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  },[])


  useEffect(()=>{
    loadJWT()
  },[loadJWT])

  if (status === 'loading') {
    return <Spinner />;
  }

  console.log(authContext?.authState)
  console.log(authContext?.authState?.authenticated);
  // if (authContext?.authState?.authenticated === false) {
  //   return <Login />;
  // } else {
  //   return <Dashboard />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          authContext?.authState?.authenticated ? (
            <>
              <Stack.Screen name="Dashboard" component={Dashboard} />
            </>)
             :( <>
             <Stack.Screen name="Login"  component={Login}/>
             <Stack.Screen name="SignUp"  component={SignUp}/>
             </>
          )
        }
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // return (
  //   <SafeAreaView style={backgroundStyle}>
  //     <StatusBar
  //       barStyle={isDarkMode ? 'light-content' : 'dark-content'}
  //       backgroundColor={backgroundStyle.backgroundColor}
  //     />
  //     <ScrollView
  //       contentInsetAdjustmentBehavior="automatic"
  //       style={backgroundStyle}>
  //       <Header />
  //       <View
  //         style={{
  //           backgroundColor: isDarkMode ? Colors.black : Colors.white,
  //         }}>
  //         <Section title="Step One">
  //           Edit <Text style={styles.highlight}>App.js</Text> to change this
  //           screen and then come back to see your edits.
  //         </Section>
  //         <Section title="See Your Changes">
  //           <ReloadInstructions />
  //         </Section>
  //         <Section title="Debug">
  //           <DebugInstructions />
  //         </Section>
  //         <Section title="Learn More">
  //           Read the docs to discover what to do next:
  //         </Section>
  //         <LearnMoreLinks />
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
};

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
