import cv2 as cv

url = 'http://192.168.1.28:81/stream'
cap = cv.VideoCapture(url)

winName = 'IP_CAM'
cv.namedWindow(winName, cv.WINDOW_AUTOSIZE)

while(True):
    cap.open(url)
    ret ,frame = cap.read()

    if ret:
        cv.imshow(winName, frame)

    tecla = cv.waitKey(1) & 0xFF
    if tecla == 27:
        break

cv.destroyAllWindows()