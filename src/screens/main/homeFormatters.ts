import { ContestItem } from './homeTypes';

type CountdownResult = {
  label: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function parseDate(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function getContestCountdown(contest: ContestItem, nowMs: number): CountdownResult {
  const startAt = parseDate(contest.startAt);
  const endAt = parseDate(contest.endAt);

  let target = startAt;
  let label = 'Starting In';

  if (startAt && startAt.getTime() <= nowMs && endAt && endAt.getTime() > nowMs) {
    target = endAt;
    label = 'Ends In';
  }

  if (!target) {
    return {
      label,
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  const remainingMs = Math.max(target.getTime() - nowMs, 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    label,
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

export function getAvailableSpotsLabel(contest: ContestItem): string {
  return `${Math.max(contest.availableSpots, 0)} left`;
}

