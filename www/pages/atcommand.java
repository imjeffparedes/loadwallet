import java.io.*;
import javax.comm.*;
import java.util.*;
 
public class PortWriter
{
    static Enumeration ports;
    static CommPortIdentifier pID;
    static OutputStream outStream;
    static SerialPort serPort;
    static BufferedReader is;   
    static PrintStream    os;         
     
    public PortWriter() throws Exception{
        try
        {        
            serPort = (SerialPort)pID.open("/dev/ttyUSB0",2000);
            System.out.println();
            System.out.println();
            serPort.setSerialPortParams(9600,SerialPort.DATABITS_8,SerialPort.STOPBITS_1,SerialPort.PARITY_NONE);
       
            try {
              is = new BufferedReader(new InputStreamReader(serPort.getInputStream()));
            } catch (IOException e) {
              System.err.println("Can't open input stream: write-only");
              is = null;
            }

            os = new PrintStream(serPort.getOutputStream(),true, "ISO-8859-1");
        }
        catch (PortInUseException e)
        {
            System.out.println("PortInUseException : "+e);
        }
        catch (Exception e)
        {
            System.out.println("PortInUseException : "+e);
        }
 
    }    
     
    public static void main(String[] args) throws Exception{
        ports = CommPortIdentifier.getPortIdentifiers();
         
        while(ports.hasMoreElements())
        {
            pID = (CommPortIdentifier)ports.nextElement();
            System.out.println("Port " + pID.getName());
             
            if (pID.getPortType() == CommPortIdentifier.PORT_SERIAL)
            {
                if (pID.getName().equals("/dev/ttyUSB0"))
                {
                    PortWriter pWriter = new PortWriter();
                    System.out.println("USB found");
                    try {
                    
                    os.print("AT+CMGF=1");
                    os.print("\r\n");
                    is.readLine();                   
                    is.readLine();
                    is.readLine(); 
                    String cmgfresponse = is.readLine();    
                    System.out.println("CMGF Response is :"+cmgfresponse); 
                    os.print("AT+CMGS=\"+60165522334\"");
                    os.print("\r\n");
                    is.readLine();                   
                    is.readLine();
                    is.readLine(); 
                    String cmgsresponse = is.readLine();    
                    System.out.println("CMGS Response is :"+cmgsresponse);
                    if (is != null) 
                        is.close();
                    if (os != null) 
                        os.close();
                    if (serPort != null) 
                        serPort.close();                    
                    } 
                    catch (IOException e)                   
                    {                   
                        System.out.println("could not write to outputstream:");                 
                        System.out.println(e.toString());                   
                    }
                }
            }
        }
         
    }}