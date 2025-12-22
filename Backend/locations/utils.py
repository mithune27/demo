from math import radians, cos, sin, asin, sqrt


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
    center_lat,
    center_lon,
    radius_meters
):
    """
    Returns True if the point is inside the geofence radius
    """

    distance = calculate_distance(
        lat,
        lon,
        center_lat,
        center_lon
    )

    return distance <= radius_meters
