import React, { useState, useEffect } from 'react'

// eslint-disable-next-line no-unused-vars
import Joyride, { Styles, Step, CallBackProps, STATUS } from 'react-joyride'
import Papa from 'papaparse'

const joyrideStyles: Styles = {
  beaconOuter: {
    borderColor: 'var(--chakra-colors-red-500)'
  },
  beaconInner: {
    background: 'var(--chakra-colors-red-500)'
  },
  options: {
    arrowColor: 'var(--chakra-colors-gray-600)',
    backgroundColor: 'var(--chakra-colors-gray-600)',
    textColor: '#fff'
  },
  tooltip: {
    fontSize: '.9rem'
  },
  buttonNext: {
    backgroundColor: 'var(--chakra-colors-purple-200)',
    color: 'var(--chakra-colors-gray-800)',
    fontSize: '.8rem'
  },
  buttonBack: {
    color: 'var(--chakra-colors-gray-200)',
    fontSize: '.8rem'
  }
}

const Guide = ({
  csvFile = '/guide.csv',
  storageKey = 'BA_GUIDE',
  overrideStyle = {} as Styles
}: {
  csvFile?: string
  storageKey?: string
  overrideStyle?: Styles
}) => {
  const [steps, setSteps] = useState<Step[]>([])

  const getData = async (): Promise<Step[]> => {
    const steps: Step[] = []

    const res = await fetch(csvFile)

    if (!res.body) return []

    const reader = res.body.getReader()
    const result = await reader.read()
    const decoder = new TextDecoder('utf-8')
    const csv = decoder.decode(result.value)
    const results = Papa.parse(csv, { header: true })

    const data = results.data.filter((f: any) => f.Target.length)

    data.forEach((row: any, i: number) => {
      const step: Step = {
        target: row.Target,
        content: (
          <div
            className='Container'
            dangerouslySetInnerHTML={{ __html: row.Content }}
          />
        ),
        disableBeacon: true,
        event: 'hover',
        showProgress: true,
        showSkipButton: true
      }

      if (row.Target === 'body') {
        step.placement = 'center'
      }

      if (i < data.length - 1) {
        step.locale = {
          skip: <strong aria-label='skip'>End Tutorial</strong>,
          close: <strong aria-label='next'>Next</strong>
        }
      } else {
        step.locale = {
          skip: <strong aria-label='skip'>End Tutorial</strong>
        }
      }

      steps.push(step)
    })

    return steps
  }

  useEffect(() => {
    if (!localStorage.getItem(storageKey))
      getData()
        .then((data) => setSteps(data))
        .catch(console.error)
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(storageKey, '1')
    }
  }

  // Render nothing if Guide is already complete
  if (localStorage.getItem(storageKey)) return <div />

  return (
    <Joyride
      steps={steps}
      styles={Object.keys(overrideStyle).length ? overrideStyle : joyrideStyles}
      callback={handleJoyrideCallback}
    />
  )
}

export default Guide
