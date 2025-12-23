from datetime import time

LUNCH_START = time(13, 0)  # 1:00 PM
LUNCH_END = time(14, 0)    # 2:00 PM


def calculate_effective_seconds(check_in, check_out):
    """
    Returns working seconds excluding lunch time (1–2 PM)
    """
    total_seconds = int((check_out - check_in).total_seconds())

    lunch_start_dt = check_in.replace(
        hour=13, minute=0, second=0
    )
    lunch_end_dt = check_in.replace(
        hour=14, minute=0, second=0
    )

    overlap_start = max(check_in, lunch_start_dt)
    overlap_end = min(check_out, lunch_end_dt)

    lunch_overlap = max(
        0,
        int((overlap_end - overlap_start).total_seconds())
    )

    return max(0, total_seconds - lunch_overlap)
