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

import java.io.*;

public class Debug
{

	private static PrintStream _out = null;
	private static PrintStream _err = null;

	// Returns the actual out stream.
	static PrintStream out()
	{
		replace();
		return _out == null ? System.out : _out;
	}
	
	// Returns the actual err stream.
	static PrintStream err()
	{
		replace();
		return _err == null ? System.err : _err;
	}
	
	// Replaces the out and err stream to dummy streams.
	private static void replace()
	{
		if (GameConfig.PREVENT_MOUSE_IO)
		{
			if (_out == null)
			{
				_out = System.out;
				System.setOut(new PrintStream(new OutputStream()
				{
					public void close() {}                 
					public void flush() {}                 
					public void write(byte[] b) {}                 
					public void write(byte[] b, int off, int len) {}                
					public void write(int b) {}
				}));
			}
			
			if (_err == null)
			{
				_err = System.err;
				System.setErr(new PrintStream(new OutputStream()
				{
					public void close() {}                 
					public void flush() {}                 
					public void write(byte[] b) {}                 
					public void write(byte[] b, int off, int len) {}                
					public void write(int b) {}
				}));
			}
		}
	}
	

}