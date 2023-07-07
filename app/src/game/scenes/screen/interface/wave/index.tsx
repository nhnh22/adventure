import cn from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { GameContext, useWorldUpdate } from '~lib/interface';
import { formatTime } from '~lib/utils';
import { ComponentHint } from '~scene/basic/interface/hint';
import { TutorialStep } from '~type/tutorial';

import {
  CurrentNumber, Container, State, Wrapper,
} from './styles';

export const ComponentWave: React.FC = () => {
  const game = useContext(GameContext);

  const [currentNumber, setCurrentNumber] = useState(1);
  const [value, setValue] = useState(null);
  const [isGoing, setGoing] = useState(false);
  const [isAlarm, setAlarm] = useState(false);
  const [isNextSeason, setNextSeason] = useState(false);
  const [isPeaceMode, setPeaceMode] = useState(false);
  const [hint, setHint] = useState<string>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.WAVE_TIMELEFT: {
        return setHint('Here display timeleft to start enemies attack');
      }
      case TutorialStep.WAVE_SEASON: {
        return setHint(
          'Every end of season, you can choose when to start next wave',
        );
      }
    }
  };

  const hideHint = () => {
    setHint(null);
  };

  useEffect(
    () => game.tutorial.bindAll({
      beg: showHint,
      end: hideHint,
    }),
    [],
  );

  useWorldUpdate(() => {
    setPeaceMode(game.world.wave.isPeaceMode);
    setCurrentNumber(game.world.wave.number);
    setGoing(game.world.wave.isGoing);
    setNextSeason(game.world.wave.isNextSeason);

    if (game.world.wave.isGoing) {
      const enemiesLeft = game.world.wave.getEnemiesLeft();

      setValue(enemiesLeft);
      setAlarm(false);
    } else {
      const timeleft = game.world.wave.getTimeleft();

      setValue(formatTime(timeleft));
      setAlarm(timeleft <= WAVE_TIMELEFT_ALARM && !game.world.isTimePaused());
    }
  });

  return (
    !isPeaceMode && (
      <Wrapper>
        <Container>
          <CurrentNumber className={cn({ going: isGoing })}>
            {currentNumber}
          </CurrentNumber>
          <State>
            {isNextSeason ? (
              <>
                <State.Label>NEXT SEASON</State.Label>
                <State.Action onClick={() => game.world.wave.skipTimeleft()}>
                  START
                </State.Action>
              </>
            ) : (
              <>
                <State.Label>
                  {isGoing ? 'ENEMIES LEFT' : 'TIME LEFT'}
                </State.Label>
                <State.Value className={cn({ alarm: isAlarm })}>
                  {value}
                </State.Value>
              </>
            )}
          </State>
        </Container>

        {hint && <ComponentHint side="top">{hint}</ComponentHint>}
      </Wrapper>
    )
  );
};

ComponentWave.displayName = 'ComponentWave';
