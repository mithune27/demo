from math import radians, cos, sin, asin, sqrt, atan2



def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two latitude/longitude points in meters
    using the Haversine formula.
    """

    R = 6371000  # Earth radius in meters

    lat1, lon1, lat2, lon2 = map(
        radians, [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))

    return R * c




def is_inside_geofence(
    lat,
    lon,
    fence_lat,
    fence_lon,
    radius,
    return_distance=False
):
    R = 6371000  # Earth radius in meters

    dlat = radians(fence_lat - lat)
    dlon = radians(fence_lon - lon)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat))
        * cos(radians(fence_lat))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    inside = distance <= radius

    if return_distance:
        return inside, round(distance, 2)

    return inside
