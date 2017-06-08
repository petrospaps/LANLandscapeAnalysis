#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Collect the infromation from the https://data.police.uk/docs/method/crime-street/ API
    Using https://github.com/rkhleics/police-api-client-python/
"""

from police_api import PoliceAPI

from matchingClosestPoint import closest
from scipy.stats import zscore
import numpy as np

api = PoliceAPI()
# forces = api.get_forces()


def get_closest_street_id(streets_location, closest_street):
    """
    """
    for k in streets_location:
        if float(streets_location[k]['lat']) == float(closest_street['lat']):
            if streets_location[k]['lon'] == closest_street['lon']:
                return k

def aggregate_crime_per_street(crime_location):
    """
    """
    crime_count = dict()
    streets_location = dict()
    for crime in crime_location:
        street = crime.location.street['id']
        location = {'lat': crime.location.latitude,
                    'lon': crime.location.longitude}
        streets_location[street] = location

        crime_count[street] = crime_count.get(street, 0) +1
    return crime_count, streets_location


def crime_around_location(latitude, longitude):
    location_to_match = {'lat': latitude, 'lon': longitude}
    crime_location = api.get_crimes_point(latitude, longitude)
    crime_count, streets_location = aggregate_crime_per_street(crime_location)
    # closest_street = closest(list_to_match, location_to_match)
    closest_street = closest(streets_location.values(), location_to_match)
    proper_street = get_closest_street_id(streets_location, closest_street)
    print('Number of crime at the location: {}'.format(sum(crime_count.values())))
    print('Number of street at the location: {}'.format(len(crime_count)))
    return crime_count, proper_street


def zscore_from_dict(d):
    """Code from
    https://stackoverflow.com/a/27082832/3193951
    """
    keys, vals = zip(*d.items())
    return dict(zip(keys, zscore(vals, ddof=1)))

def get_location_score(latitude, longitude):
    """
    """
    crime_count, proper_street = crime_around_location(latitude, longitude)
    zscores = zscore_from_dict(crime_count)
    return zscores[proper_street]


def main():
    """
    """
    list_of_location = [[50.89967, -1.403664],
                        [50.902688, -1.404179],
                        [50.899563, -1.405402],
                        [50.910578, -1.405019],
                        [50.897369, -1.407312],
                        [50.902705, -1.411153],
                        [50.896933, -1.394094]]

    for loc in list_of_location:
        print(get_location_score(loc[0], loc[1]))


if __name__ == "__main__":
    main()
