import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Background location: ", locations);
  }
});

export async function startBackgroundLocation() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 5,
      showsBackgroundLocationIndicator: true,
    });
  } else {
    console.error("Background location permission not granted");
  }
}

export async function stopBackgroundLocation() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}
