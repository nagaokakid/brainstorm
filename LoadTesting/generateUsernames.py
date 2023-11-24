import csv

with open("usernames.csv", mode="w", newline='') as file:
    writer = csv.writer(file)
    baseUsername = 'loadTestUser'

    for i in range(1, 21):
        username = baseUsername + str(i)
        writer.writerow([username])    