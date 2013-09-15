############################################################################
# WAVEFRONT ALGORITHM
# Adapted to Python Code By Darin Velarde
# Fri Jan 29 13:56:53 PST 2010
# from C code from John Palmisano 
# (www.societyofrobots.com)
############################################################################
try:
    import numpy
except:
    print "The numpy math library is not installed."
import time
############################################################################


class waveFrontPlanner:

    def __init__(self, map, slow=False):
        self.__slow = slow
        self.__map = map
        if str(type(map)).find("numpy") != -1:
            #If its a numpy array
            self.__height, self.__width = self.__map.shape
        else:
            self.__height, self.__width = len(self.__map), len(self.__map[0])

        self.__nothing = 0
        self.__wall = 999
        self.__goal = 1
        self.__path = "PATH"

        self.__finalPath = []

        #Robot value
        self.__robot = 254
        #Robot default Location
        self.__robot_x = 0
        self.__robot_y = 0

        #default goal location
        self.__goal_x = 8
        self.__goal_y = 9

        #temp variables
        self.__temp_A = 0
        self.__temp_B = 0
        self.__counter = 0
        self.__steps = 0 #determine how processor intensive the algorithm was

        #when searching for a node with a lower value
        self.__minimum_node = 250
        self.__min_node_location = 250
        self.__new_state = 1
        self.__old_state = 1
        self.__reset_min = 250 #above this number is a special (wall or robot)
    ###########################################################################

    def setRobotPosition(self, x, y):
        """
        Sets the robot's current position

        """

        self.__robot_x = x
        self.__robot_y = y
    ###########################################################################

    def setGoalPosition(self, x, y):
        """
        Sets the goal position.

        """

        self.__goal_x = x
        self.__goal_y = y
    ###########################################################################

    def robotPosition(self):
        return  (self.__robot_x, self.__robot_y)
    ###########################################################################

    def goalPosition(self):
        return  (self.__goal_x, self.__goal_y)
    ###########################################################################

    def run(self, prnt=False):
        """
        The entry point for the robot algorithm to use wavefront propagation.

        """

        path = []
        while self.__map[self.__robot_x][self.__robot_y] != self.__goal:
            if self.__steps > 20000:
                print "Cannot find a path."
                return
            #find new location to go to
            self.__new_state = self.propagateWavefront()
            #update location of robot
            if self.__new_state == 1:
                self.__robot_x -= 1
                if prnt:
                    print "Move to x=%d y=%d\n\n" % \
                        (self.__robot_x, self.__robot_y)
                path.append((self.__robot_x, self.__robot_y))
            if self.__new_state == 2:
                self.__robot_y += 1
                if prnt:
                    print "Move to x=%d y=%d\n\n" % \
                        (self.__robot_x, self.__robot_y)
                path.append((self.__robot_x, self.__robot_y))
            if self.__new_state == 3:
                self.__robot_x += 1
                if prnt:
                    print "Move to x=%d y=%d\n\n" % \
                        (self.__robot_x, self.__robot_y)
                path.append((self.__robot_x, self.__robot_y))
            if self.__new_state == 4:
                self.__robot_y -= 1
                if prnt:
                    print "Move to x=%d y=%d\n\n" % \
                        (self.__robot_x, self.__robot_y)
                path.append((self.__robot_x, self.__robot_y))
            self.__old_state = self.__new_state
        msg = "Found the goal in %i steps:\n" % self.__steps
        msg += "Map size= %i %i\n\n" % (self.__height, self.__width)
        if prnt:
            print msg
            self.printMap()
        return path
    ###########################################################################

    def propagateWavefront(self, prnt=False):
        """


        """

        self.unpropagate()
        #Old robot location was deleted, store new robot location in map
        self.__map[self.__robot_x][self.__robot_y] = self.__robot
        self.__path = self.__robot
        #start location to begin scan at goal location
        self.__map[self.__goal_x][self.__goal_y] = self.__goal
        counter = 0
        while counter < 200:  #allows for recycling until robot is found
            x = 0
            y = 0
            time.sleep(0.00001)
            #while the map hasnt been fully scanned
            while x < self.__height and y < self.__width:
                #if this location is a wall or the goal, just ignore it
                if self.__map[x][y] != self.__wall and \
                    self.__map[x][y] != self.__goal:
                    #a full trail to the robot has been located, finished!
                    minLoc = self.minSurroundingNodeValue(x, y)
                    if minLoc < self.__reset_min and \
                        self.__map[x][y] == self.__robot:
                        if prnt:
                            print "Finished Wavefront:\n"
                            self.printMap()
                        # Tell the robot to move after this return.
                        return self.__min_node_location
                    #record a value in to this node
                    elif self.__minimum_node != self.__reset_min:
                        #if this isnt here, 'nothing' will go in the location
                        self.__map[x][y] = self.__minimum_node + 1
                #go to next node and/or row
                y += 1
                if y == self.__width and x != self.__height:
                    x += 1
                    y = 0
            #print self.__robot_x, self.__robot_y
            if prnt:
                print "Sweep #: %i\n" % (counter + 1)
                self.printMap()
            self.__steps += 1
            counter += 1
        return 0
    ###########################################################################

    def unpropagate(self):
        """
        clears old path to determine new path
        stay within boundary

        """

        for x in range(0, self.__height):
            for y in range(0, self.__width):
                if self.__map[x][y] != self.__wall and \
                    self.__map[x][y] != self.__goal and \
                    self.__map[x][y] != self.__path:
                    #if this location is a wall or goal, just ignore it
                    self.__map[x][y] = self.__nothing #clear that space
    ###########################################################################

    def minSurroundingNodeValue(self, x, y):
        """
        this method looks at a node and returns the lowest value around that
        node.

        """

        #reset minimum
        self.__minimum_node = self.__reset_min
        #down
        if x < self.__height -1:
            if self.__map[x + 1][y] < self.__minimum_node and \
                self.__map[x + 1][y] != self.__nothing:
                #find the lowest number node, and exclude empty nodes (0's)
                self.__minimum_node = self.__map[x + 1][y]
                self.__min_node_location = 3
        #up
        if x > 0:
            if self.__map[x-1][y] < self.__minimum_node and \
                self.__map[x-1][y] != self.__nothing:
                self.__minimum_node = self.__map[x-1][y]
                self.__min_node_location = 1
        #right
        if y < self.__width -1:
            if self.__map[x][y + 1] < self.__minimum_node and \
                self.__map[x][y + 1] != self.__nothing:
                self.__minimum_node = self.__map[x][y + 1]
                self.__min_node_location = 2
        #left
        if y > 0:
            if self.__map[x][y - 1] < self.__minimum_node and \
                self.__map[x][y - 1] != self.__nothing:
                self.__minimum_node = self.__map[x][y-1]
                self.__min_node_location = 4
        return self.__minimum_node
    ###########################################################################

    def printMap(self):
        """
        Prints out the map of this instance of the class.

        """

        msg = ''
        for temp_B in range(0, self.__height):
            for temp_A in range(0, self.__width):
                if self.__map[temp_B][temp_A] == self.__wall:
                    msg += "%04s" % "[#]"
                elif self.__map[temp_B][temp_A] == self.__robot:
                    msg += "%04s" % "-"
                elif self.__map[temp_B][temp_A] == self.__goal:
                    msg += "%04s" % "G"
                else:
                    msg += "%04s" % str(self.__map[temp_B][temp_A])
            msg += "\n\n"
        msg += "\n\n"
        print msg
        #
        if self.__slow == True:
            time.sleep(0.05)
###############################################################################

if __name__ == "__main__":
    """
    X is vertical, Y is horizontal

    """

    floormap = [[000,000,000,000,000,000,000,000,000,000,000,000], \
                [000,000,999,999,999,999,999,999,000,000,000,000], \
                [000,000,999,000,000,000,000,999,999,999,999,999], \
                [000,000,999,000,999,999,000,000,000,000,999,000], \
                [000,999,999,000,000,999,000,000,000,000,999,000], \
                [000,999,000,000,999,999,999,999,999,000,999,000], \
                [000,999,000,000,999,000,000,000,999,000,999,000], \
                [000,999,000,999,999,999,000,000,999,000,999,999], \
                [000,999,000,000,000,000,000,000,999,000,000,000], \
                [000,999,999,999,999,999,999,000,999,000,999,999], \
                [000,000,000,999,000,000,000,000,999,000,999,000], \
                [000,999,999,999,999,999,999,999,999,000,000,000], \
                [000,000,000,000,000,000,000,000,999,000,000,000], \
                [000,999,000,000,000,000,000,000,999,000,000,000], \
                [000,999,000,999,000,999,999,000,999,999,999,000], \
                [000,999,000,999,000,999,000,999,000,000,000,000], \
                [000,999,000,999,000,000,000,000,000,999,000,000], \
                [000,999,999,000,000,999,000,000,000,000,999,000], \
                [000,000,000,999,000,000,000,999,000,999,000,000]]

    start = time.time()
    planner = waveFrontPlanner(floormap, False)
    planner.run(True)
    end = time.time()
    print "Took %f seconds to run wavefront simulation" % (end - start)
