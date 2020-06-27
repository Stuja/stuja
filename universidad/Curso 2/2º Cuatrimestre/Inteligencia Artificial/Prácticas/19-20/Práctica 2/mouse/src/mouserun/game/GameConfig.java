/** 
 * MouseRun. A programming game to practice building intelligent things.
 * Copyright (C) 2013  Muhammad Mustaqim
 * 
 * This file is part of MouseRun.
 *
 * MouseRun is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MouseRun is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MouseRun.  If not, see <http://www.gnu.org/licenses/>.
 **/
package mouserun.game;

/**
* Class GameConfiguration is a common location to edit Fixed game settings.
*/
public class GameConfig
{

	/** UI **/
	public static final String GAME_TITLE				= "Mouse Run";
	public static final int GRID_LENGTH					= 30;
	public static final int MOUSE_CHEESE_DISPLAY_LENGTH	= 40;
	public static final int COUNT_DOWN_FONT_SIZE			= 200;
	public static final String CHEESE_NUMBER_FORMAT		= "00";
	
	/** Assets **/
	public static final String ASSETS_BOMB				= "assets/bomb.png";
	public static final String ASSETS_EXPLODED			= "assets/exploded.png";
	public static final String ASSETS_CHEESE				= "assets/cheese.png";
	public static final String ASSETS_MOUSEUP			= "assets/mouseup.png";
	public static final String ASSETS_MOUSEDOWN			= "assets/mousedown.png";
	public static final String ASSETS_MOUSELEFT			= "assets/mouseleft.png";
	public static final String ASSETS_MOUSERIGHT			= "assets/mouseright.png";
	
	/** Logic **/
	public static final double RATIO_BOMBS_TO_CHEESE		= 0.1;
	public static final double RATIO_CLOSED_WALL_TO_OPEN	= 0.03;
	public static final int PIXELS_PER_TURN				= 10;
	public static final int PIXELS_ON_TARGET_LEEWAY		= 5;
	public static final int DISEASES_TO_RETIRE			= 5;
	public static final int MOUSE_RESPONSE_TIMEOUT		= 50;
	public static final int ROUND_SLEEP_TIME				= 80;

	/** Security **/
	public static final boolean INSTALL_SECURITY_MANAGER	= true;
	public static final boolean PREVENT_MOUSE_IO			= true;
}