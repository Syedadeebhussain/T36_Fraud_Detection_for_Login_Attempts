# ML Service

This service provides a simple FastAPI-based machine learning endpoint for login anomaly analysis.

## Overview

- Framework: `FastAPI`
- Model: `IsolationForest` from `scikit-learn`
- Purpose: Analyze login events and return an anomaly score, risk contribution, and anomaly flag.

## Files

- `app.py` - FastAPI application with `/analyze` endpoint.
- `requirements.txt` - Python dependencies.

## Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

Start the service with:

```bash
python app.py
```

The app listens on `http://0.0.0.0:5000` by default.

## API

### POST /analyze

Analyze a login event for anomalies.

#### Request body

```json
{
  "riskScore": 75,
  "hourOfDay": 14,
  "dayOfWeek": 3,
  "isNewDevice": 1,
  "isNewLocation": 0
}
```

#### Fields

- `riskScore`: integer score from 0 to 100.
- `hourOfDay`: integer hour of the day (0-23).
- `dayOfWeek`: integer day of the week (0-6).
- `isNewDevice`: binary indicator (0 or 1).
- `isNewLocation`: binary indicator (0 or 1).

#### Response

```json
{
  "anomalyScore": -0.0374,
  "mlRiskContribution": 6,
  "isAnomaly": false
}
```

- `anomalyScore`: raw anomaly score from the model.
- `mlRiskContribution`: scaled risk contribution from 0 to 100.
- `isAnomaly`: `true` when the risk contribution is greater than 50.

## Notes

- The service uses a dummy `IsolationForest` model trained on random data for demonstration. In production, replace this with a serialized trained model.
- The feature scaling used in `app.py` is fixed to the current event fields.
