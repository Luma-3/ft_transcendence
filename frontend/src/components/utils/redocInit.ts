declare const Redoc: any;

export function redocInit(spec: string, redoc_container: HTMLElement) {
	Redoc.init(spec, {
		scrollYOffset: 50,
		hideDownloadButton: true,
		expandResponses: '200,201',
		theme: {
        colors: {
          primary: {
            main: '#FF8904'
          },
          success: {
            main: '#93bf85'
          },
          background: {
            default: '#744FAC'
          },
          text: {
            primary: '#000000',
            secondary: '#333333'
          }
        },
        typography: {
          fontFamily: 'Chillax, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5em',
          headings: {
            fontFamily: 'Chillax, sans-serif',
            // fontWeight: '1000',
            lineHeight: '1.6em'
          },
          code: {
            fontFamily: 'Courier, monospace',
            fontSize: '15px',
            color: '#e53935',
            backgroundColor: 'rgba(38, 50, 56, 0.05)',
            wrap: true
          },
          links: {
            color: '#744FAC',
            visited: '#744FAC',
            hover: '#FF8904'
          }
        },
        sidebar: {
          width: '260px',
          backgroundColor: '#744FAC',
          textColor: '#FFFFFF',
          activeTextColor: '#F8E9E9',
          groupItems: {
            textTransform: 'uppercase'
          },
          level1Items: {
            textTransform: 'none'
          },
          arrow: {
            size: '1.5em',
            color: '#FFFFFF'
          }
        },
        rightPanel: {
          backgroundColor: '#744FAC',
          textColor: '#FFFFFF'
        },
        fab: {
          backgroundColor: '#744FAC',
          color: '#FFFFFF'
        }
      }
	}, redoc_container);
}