import { Platform } from "react-native"

import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs"

import { gluestackUIConfig } from "../../config/gluestack-ui.config"

import { Home } from "@screens/Home"
import { Exercise } from "@screens/Exercise"
import { History } from "@screens/History"
import { Profile } from "@screens/Profile"

import HomeSvg from "@assets/home.svg"
import HistorySvg from "@assets/history.svg"
import ProfileSvg from "@assets/profile.svg"

type AppRoutesType = {
  home: undefined; //por enquanto undefined
  exercise: undefined; //por enquanto
  profile: undefined; //por enquanto
  history: undefined; //porenquanto
}

export type AppNavigationRoutesProps = BottomTabNavigationProp<AppRoutesType>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>()

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space["6"]

  return(
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: tokens.colors.green500,
      tabBarInactiveTintColor: tokens.colors.gray200,
      tabBarStyle: {
        backgroundColor: tokens.colors.gray600,
        borderTopWidth: 0,
        height: Platform.OS === "android" ? "auto" : 96,
        paddingBottom: tokens.space["10"],
        paddingTop: tokens.space["6"]
      }
    }}>
      <Screen
       name="home" 
       component={Home} 
       options={{tabBarIcon: ({ color }) => <HomeSvg fill={color} width={iconSize} height={iconSize} />}} 
      />
      
      <Screen 
        name="history" 
        component={History} 
        options={{tabBarIcon: ({ color }) => <HistorySvg fill={color} width={iconSize} height={iconSize} />}}
      />

      <Screen 
        name="profile" 
        component={Profile} 
        options={{tabBarIcon: ({ color }) => <ProfileSvg fill={color} width={iconSize} height={iconSize} />}}
      />

      <Screen 
        name="exercise" 
        component={Exercise} 
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}