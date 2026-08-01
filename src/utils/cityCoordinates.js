// Dictionary of major Indian and global city coordinates for map centering and donor searching
export const CITY_COORDINATES = {
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'chennai': [13.0827, 80.2707],
  'hyderabad': [17.3850, 78.4867],
  'kolkata': [22.5726, 88.3639],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'surat': [21.1702, 72.8311],
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'nagpur': [21.1458, 79.0882],
  'indore': [22.7196, 75.8577],
  'thane': [19.2183, 72.9781],
  'bhopal': [23.2599, 77.4126],
  'visakhapatnam': [17.6868, 83.2185],
  'vadodara': [22.3072, 73.1812],
  'ghaziabad': [28.6692, 77.4538],
  'ludhiana': [30.9010, 75.8573],
  'agra': [27.1767, 78.0081],
  'nashik': [19.9975, 73.7898],
  'patna': [25.5941, 85.1376],
  'faridabad': [28.4089, 77.3178],
  'meerut': [28.9845, 77.7064],
  'rajkot': [22.3039, 70.8022],
  'varanasi': [25.3176, 82.9739],
  'srinagar': [34.0837, 74.7973],
  'aurangabad': [19.8762, 75.3433],
  'dhanbad': [23.7957, 86.4304],
  'amritsar': [31.6340, 74.8723],
  'navi mumbai': [19.0330, 73.0297],
  'prayagraj': [25.4358, 81.8463],
  'allahabad': [25.4358, 81.8463],
  'ranchi': [23.3441, 85.3096],
  'coimbatore': [11.0168, 76.9558],
  'jabalpur': [23.1815, 79.9864],
  'gwalior': [26.2183, 78.1828],
  'vijayawada': [16.5062, 80.6480],
  'madurai': [9.9252, 78.1198],
  'guwahati': [26.1445, 91.7362],
  'chandigarh': [30.7333, 76.7794],
  'hubli': [15.3647, 75.1240],
  'hubballi': [15.3647, 75.1240],
  'mysore': [12.2958, 76.6394],
  'mysuru': [12.2958, 76.6394],
  'mangalore': [12.9141, 74.8560],
  'mangaluru': [12.9141, 74.8560],
  'trivandrum': [8.5241, 76.9366],
  'thiruvananthapuram': [8.5241, 76.9366],
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
};

export function getCityCoordinates(cityName) {
  if (!cityName) return [12.9716, 77.5946];
  const cleanName = cityName.trim().toLowerCase();
  
  // Exact or partial match
  if (CITY_COORDINATES[cleanName]) {
    return CITY_COORDINATES[cleanName];
  }

  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return coords;
    }
  }

  return [12.9716, 77.5946];
}
