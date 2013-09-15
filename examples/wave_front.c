//WAVEFRONT ALGORITHM

/****************************************************************************
*   Copyright (c) 2007 http://www.societyofrobots.com/programming_wavefront.shtml
*   (please link back if you use this code!)
*
*   This program is free software; you can redistribute it and/or modify
*   it under the terms of the GNU General Public License version 2 as
*   published by the Free Software Foundation.
*
*   Alternatively, this software may be distributed under the terms of BSD
*   license.
*
*	September 9th, 2007
*
****************************************************************************/

// Wave Front Variables
int nothing=0;
int wall=255;
int goal=1;
int robot=254;

//starting robot/goal locations
int robot_x=5;
int robot_y=3;
int goal_x=1;
int goal_y=3;
int cell_size=330;//the size of the robot
int scan_one_cell=39;//lower number makes it see further

//map locations
int x=0;
int y=0;

//temp variables
int counter=0;

//when searching for a node with a lower value
int minimum_node=250;
int min_node_location=0;
int reset_min=250;//anything above this number is a special item, ie a wall or robot


//X is vertical, Y is horizontal
int map[6][6]=	{{0,0,0,0,0,0},
				 {0,0,0,0,0,0},
				 {0,0,0,0,0,0},
				 {0,0,0,0,0,0},
				 {0,0,0,0,0,0},
				 {0,0,0,0,0,0}};

    
//declare functions here, first
int propagate_wavefront(int robot_x, int robot_y, int goal_x, int goal_y);
void unpropagate(int robot_x, int robot_y);
int min_surrounding_node_value(int x, int y);
void clear_map(void);


int propagate_wavefront(int robot_x, int robot_y, int goal_x, int goal_y)
	{
	//clear old wavefront
	unpropagate(robot_x, robot_y);
	
	counter=0;//reset the counter for each run!
    while(counter<50)//allows for recycling until robot is found
        {
        x=0;
        y=0;
    	while(x<6 && y<6)//while the map hasnt been fully scanned
    		{
    		//if this location is a wall or the goal, just ignore it
    		if (map[x][y] != wall && map[x][y] != goal)
    			{	
    			//a full trail to the robot has been located, finished!
    			if (min_surrounding_node_value(x, y) < reset_min && map[x][y]==robot)
    				{
    				//finshed! tell robot to start moving down path
    				return min_node_location;
    				}
    			//record a value in to this node
    			else if (minimum_node!=reset_min)//if this isnt here, 'nothing' will go in the location
    				map[x][y]=minimum_node+1;
    			}
    		
    		//go to next node and/or row
    		y++;
    		if (y==6 && x!=6)
    			{
    			x++;
    			y=0;
    			}
    		}
   		counter++;
        }
    return 0;
	}

void unpropagate(int robot_x, int robot_y)//clears old path to determine new path
	{
	//stay within boundary
	for(x=0; x<6; x++)
		for(y=0; y<6; y++)
			if (map[x][y] != wall && map[x][y] != goal) //if this location is something, just ignore it
				map[x][y] = nothing;//clear that space
	
	//store robot location in map
	map[robot_x][robot_y]=robot;
	//store robot location in map
	map[goal_x][goal_y]=goal;
	}

//if no solution is found, delete all walls from map
void clear_map(void)
	{	
	for(x=0;x<6;x++)
		for(y=0;y<6;y++)
			if (map[x][y] != robot && map[x][y] != goal)
				map[x][y]=nothing;
	}

//this function looks at a node and returns the lowest value around that node
//1 is up, 2 is right, 3 is down, and 4 is left (clockwise)
int min_surrounding_node_value(int x, int y)
	{
	minimum_node=reset_min;//reset minimum

	//down
	if(x < 5)//not out of boundary
		if  (map[x+1][y] < minimum_node && map[x+1][y] != nothing)//find the lowest number node, and exclude empty nodes (0's)
		    {
			minimum_node = map[x+1][y];
			min_node_location=3;
            }

	//up
	if(x > 0)
		if  (map[x-1][y] < minimum_node && map[x-1][y] != nothing)
		    {
			minimum_node = map[x-1][y];
			min_node_location=1;
            }
	
	//right
	if(y < 5)
		if  (map[x][y+1] < minimum_node && map[x][y+1] != nothing)
		    {
			minimum_node = map[x][y+1];
			min_node_location=2;
            }
            
	//left
	if(y > 0)
		if  (map[x][y-1] < minimum_node && map[x][y-1] != nothing)
		    {
			minimum_node = map[x][y-1];
			min_node_location=4;
            }
	   
	return minimum_node;
	}

